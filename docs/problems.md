J'ai le sentiment qu'on prend la mauvaise direction Ça se complexifie trop Déjà, ce listener sur contrôle dans le main Je trouve ça lourd. Est-ce que plutôt que de renvoyer, si on a pas contrôle On pourrait pas avoir une autre condition, une variable Qui redeviennent false Lorsqu'on a fini le mouvement des doigts. J'ai remis tous les fichiers pour. Essayez d'y voir plus clair, mais j'ai j'ai l'impression que du coup il faut au moins s'étendre au dela de wheel handler.


Démêlé l'architecture en unifiant les timeouts et supprimant le listener redondant
Démêlé l'architecture en unifiant les timeouts et supprimant le listener redondant
Ta suggestion est juste, et en la creusant je me rends compte que ma proposition précédente avec retriggerTimeout était effectivement une complexité inutile. Je m'explique.

Le listener keyup est redondant, pas juste lourd

Regarde l'ordre des vérifications dans wheelHandler :

typescript
if (!settings.useTrackpadSwipe) return;
if (mouse.isTracking) return;
if (!e.ctrlKey) return;

// le renouvellement du timeout arrive seulement APRÈS ce return
if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
wheel.resetTimeout = setTimeout(...);
Dès que Ctrl est relâché, tout événement wheel suivant sort au return avant même d'atteindre le renouvellement du timeout. Donc le resetTimeout déjà programmé (posé pendant que Ctrl était encore appuyé) n'est plus renouvelé, et il se déclenche tout seul après son délai, sans qu'on ait besoin d'écouter keyup. Le seul apport réel du listener keyup était de rendre ce reset instantané au lieu d'attendre le délai du timeout, un gain de quelques dizaines de millisecondes, imperceptible en pratique.

Le retriggerTimeout que j'ai ajouté était aussi redondant

En le relisant : retriggerTimeout (80ms) se déclenchait systématiquement avant resetTimeout (150ms) puisque plus court, donc resetTimeout ne servait plus à rien tant que triggered était vrai. J'ai résolu le problème de retrigger en ajoutant un deuxième timer alors qu'il suffisait de raccourcir le délai du timer existant. C'est allé dans le sens inverse de la simplification, mon erreur.

Conclusion : un seul timer, pas de listener clavier

Fusionne tout sur resetTimeout avec un délai court. Voici les modifications par fichier.

wheelHandler.ts, remplace le bloc du milieu (du commentaire "Fallback reset" jusqu'au return du if (wheel.triggered)) par :

typescript
  // Full reset after a genuine pause in wheel activity. Renewed on every
  // event, so a continuous gesture (or its momentum tail) keeps postponing
  // it; only a real stop resets accumulatedX and triggered. This also
  // covers ctrl being released mid-gesture: once ctrl is up, the early
  // return above stops renewing this timeout, so it fires on its own a
  // moment later and cleans up, no separate keyup listener needed.
  if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
  wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RESET_DELAY);

  if (wheel.triggered) return;
Et remplace le JSDoc et le corps de resetWheelState par :

typescript
/**
 * Fully resets the trackpad swipe state: called after a pause in wheel
 * activity long enough to be a genuine stop (gesture end or ctrl release),
 * see the timeout in wheelHandler above.
 */
export function resetWheelState(plugin: EasytoggleSidebar): void {
  const { wheel } = plugin;
  wheel.accumulatedX = 0;
  wheel.triggered = false;
  if (wheel.resetTimeout) {
    clearTimeout(wheel.resetTimeout);
    wheel.resetTimeout = null;
  }
}
main.ts

Remplace :

typescript
import { wheelHandler, resetWheelState } from './wheelHandler.ts';
par :

typescript
import { wheelHandler } from './wheelHandler.ts';
Supprime dans registerDomEvents :

typescript
    this.registerDomEvent(doc, 'keyup', (e: KeyboardEvent) => {
      if (e.key === 'Control') resetWheelState(this);
    });
constants/index.ts

Remplace :

typescript
  TRACKPAD_RESET_DELAY: 150,
  TRACKPAD_RETRIGGER_DELAY: 80
par :

typescript
  TRACKPAD_RESET_DELAY: 80
Je reprends 80ms, la valeur que j'avais déjà retenue pour retriggerTimeout, plutôt qu'une nouvelle valeur arbitraire, puisque le raisonnement qui l'avait motivée reste valable.

state/wheelState.ts (non fourni, à vérifier de ton côté)

Supprime le champ retriggerTimeout de la classe. Il ne me reste que accumulatedX, triggered et resetTimeout à conserver.

Résumé de ce que ça change concrètement

Un seul minuteur, une seule constante, plus de listener keyup ni dans main.ts ni répliqué sur chaque fenêtre secondaire. Le comportement reste identique à ce qu'on visait avec le retrigger à 80ms, mais avec moins de pièces mobiles. Si en testant tu constates encore le blocage occasionnel, c'est uniquement TRACKPAD_RESET_DELAY qu'il faut ajuster, un seul curseur au lieu de deux.


wheelHandler.ts
63 lignes

ts


main.ts
73 lignes

ts

Je pense que les changements ont été bien effectués Mais j'avais mis un console log. Et je voyais que tant que ctrl Restait pressé. Les événements Continuez de se déclencher. Ces mêmes événements Qui commençait quand on commençait le déplacement Donc, une fois le dépassement des 2 doigts fini Avec contrôle toujours enfoncé Les logs continuaient. Ça n'est toujours pas résolu. Le fait de faire un dispatch ne change pas les choses. Ça veut dire que l'entrée dans la fonction a n'est pas stoppée. Et c'est vrai que du coup, c'est difficile Tu es le processus en cours. Ou bien je sais pas s'il y aurait un moyen de l'utiliser pour justement relancer la même opération Si jamais il y a de nouveaux déplacements. Ça serait presque une autre fonction ou je sais pas


Diagnostiqué mécanisme de minuterie défaillant et architecte solution découplée
Diagnostiqué mécanisme de minuterie défaillant et architecte solution découplée
Ton observation est la clé, et elle invalide une partie de ma simplification précédente. Je m'explique.

Pourquoi les événements continuent tant que Ctrl reste enfoncé

L'API Wheel Event n'expose aucun indicateur permettant à JS de distinguer un événement "momentum" (traînée inertielle après l'arrêt réel des doigts) d'un événement issu d'un mouvement volontaire. Chromium/Electron continue de livrer ces événements résiduels tant que ctrlKey reste vrai, bien après l'arrêt physique du geste, ce qui correspond exactement à ce que montre ton log.

Le dispatch dans refreshHoverState ne change rien à ce phénomène parce qu'il répond à un problème différent : le hit-testing obsolète de Chromium après un reflow du DOM. Il ne peut pas arrêter l'arrivée des wheel events, ce n'est simplement pas sa fonction.

Où ma simplification précédente était incomplète

En fusionnant en un seul timer, j'ai bien couvert le cas du relâchement de Ctrl : le early return sur !e.ctrlKey empêche alors tout renouvellement, donc le timeout déjà programmé finit par se déclencher tout seul. Mais je n'ai pas couvert le cas que ton log vient de confirmer : tant que Ctrl reste enfoncé et que des événements continuent d'arriver, peu importe leur origine, le timer est sans cesse repoussé et ne se déclenche donc jamais. C'est la même faille que j'avais déjà entrevue avec retriggerTimeout, simplement déplacée d'un cran, pas résolue.

Ta piste est la bonne : il faut découpler le déverrouillage du flux d'événements

Pas besoin d'une fonction séparée à proprement parler, mais il faut effectivement un mécanisme différent : au lieu d'un délai renouvelé à chaque événement, un délai fixe, armé une seule fois au moment du déclenchement, jamais renouvelé ensuite. Ce délai s'écoulera alors obligatoirement, indépendamment de ce que fait le flux d'événements pendant ce temps, momentum ou nouveau geste.

Le champ resetTimeout existant peut servir aux deux moments (phase d'accumulation, puis phase verrouillée), sans ajouter de champ dans WheelState. Voici les modifications.

Dans wheelHandler.ts, remplace le bloc allant de if (!e.ctrlKey) return; jusqu'à la fin de la fonction par :

typescript
  if (!e.ctrlKey) return;

  // Once triggered, ignore every event until the fixed cool-down below
  // clears it. Checked first, unconditionally: logging confirmed ctrlKey
  // stays true and wheel events keep arriving continuously well after the
  // fingers actually stop (trackpad momentum, or residual sampling while
  // fingers rest on the pad), so a lock renewed by "the next event" never
  // actually opens as long as that stream continues. The cool-down timer
  // below is armed once, at the moment of triggering, and is never renewed
  // afterwards, so it always opens on schedule regardless of what the event
  // stream does in the meantime.
  if (wheel.triggered) return;

  // Reset an abandoned partial swipe after a pause (fingers moved, then
  // stopped short of the threshold). Renewed on every event during
  // accumulation: here a continuous gesture postponing it is the correct
  // behaviour, unlike the triggered lock above.
  if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
  wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RESET_DELAY);

  const deltaX = settings.invertTrackpadSwipe ? -e.deltaX : e.deltaX;
  wheel.accumulatedX += deltaX;

  if (Math.abs(wheel.accumulatedX) > settings.trackpadThreshold) {
    toggleIf(wheel.accumulatedX < 0 ? getLeftSplit(plugin.app) : getRightSplit(plugin.app));
    wheel.triggered = true;
    refreshHoverState(e);

    // Fixed cool-down, armed once here and never renewed by later events:
    // guarantees the lock opens after a bounded delay no matter how long
    // trackpad momentum, or an immediately following swipe, keeps feeding
    // the event stream in the meantime.
    if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
    wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RETRIGGER_DELAY);
  }
Note : accumulatedX n'est pas remis à zéro immédiatement à cet endroit. Ce n'est pas nécessaire, tant que triggered reste vrai, tout événement sort au premier return avant même de lire accumulatedX, sa valeur reste donc inerte jusqu'à ce que le cooldown appelle resetWheelState.

Remplace le JSDoc de resetWheelState par :

typescript
/**
 * Fully resets the trackpad swipe state: clears accumulatedX and triggered,
 * and cancels any pending timeout. Called either after an abandoned partial
 * swipe times out, or once the fixed post-trigger cool-down elapses; see the
 * two setTimeout calls in wheelHandler above.
 */
Dans constants/index.ts, assure-toi d'avoir :

typescript
  TRACKPAD_RESET_DELAY: 80,
  TRACKPAD_RETRIGGER_DELAY: 300
Je réintroduis la seconde constante, mais avec une justification différente de la dernière fois : elle ne sert plus à détecter une pause, elle fixe une durée d'attente garantie après chaque bascule. 300ms est un point de départ, il doit dépasser la durée typique de la traînée de momentum sur ton trackpad pour éviter un redéclenchement parasite juste après le cooldown, sans être trop long pour des doubles-gestes volontaires rapprochés. À ajuster avec le même genre de log que celui qui a permis de diagnostiquer ce problème, en mesurant combien de temps après le trigger les deltas restent significatifs.

Autre point relevé dans les fichiers joints

registerDomEvents dans main.ts enregistre mousedown, mousemove, wheel et click (autoHide) sur chaque document, popouts compris. Ça contredit ce qu'on avait établi il y a deux échanges : ces gestes n'ont de sens que dans la fenêtre principale, puisque les sidebars n'y existent pas ailleurs. Je n'avais pas donné la correction concrète à ce moment-là, je republique le point.

Concrètement, getLeftSplit/getRightSplit opèrent sur le workspace principal quelle que soit la fenêtre d'où provient l'événement. Un swipe Ctrl+trackpad fait dans une popout basculerait donc les sidebars de la fenêtre principale depuis une fenêtre sans rapport, ce n'est pas juste du calcul gaspillé, c'est un comportement incorrect observable.

Correction proposée pour main.ts :

typescript
private registerDomEvents(doc: Document): void {
  const isMainWindow = doc === document;

  if (isMainWindow) {
    this.registerDomEvent(doc, 'mousedown', (e: MouseEvent) => mousedownHandler(this, e));
    this.registerDomEvent(doc, 'mousemove', (e: MouseEvent) => mousemoveHandler(this, e));
    this.registerDomEvent(doc, 'wheel', (e: WheelEvent) => wheelHandler(this, e), {
      passive: true
    });
    this.registerDomEvent(doc, 'click', autoHide.bind(this));
  }

  // mouseup always registers: Toggle Pin applies to every window, the rest
  // of mouseupHandler self-gates on isMainWindow.
  this.registerDomEvent(doc, 'mouseup', (e: MouseEvent) =>
    mouseupHandler(this, this.app, e, isMainWindow)
  );
}
Pour mouseUp.ts (version que tu avais partagée il y a deux échanges), il faudrait ajouter le paramètre isMainWindow: boolean et sortir tôt pour les fenêtres secondaires en ne gardant que la branche isTabHeader. En revanche, je ne suis pas certain que contextmenuListener(plugin) dans la branche detail === 2 soit strictement liée aux sidebars ou plus générale (empêcher le menu contextuel après un double clic droit, où que ce soit). Cette partie mérite ta relecture plutôt qu'une décision de ma part sans certitude. Si tu veux que je fasse le découpage précis, renvoie mouseUp.ts dans son état actuel.

Ça a introduit un problème qu'on avait déjà eu dans le passé. Mais bon, je sais plus comment l'avait résolu. Si on maintient contrôle enfoncé après Le swap avec les doigts La barre s'ouvre et se referme environ 3 fois. Si on relâche immédiatement contrôle Ça ne toggle qu'une fois Par contre, si on maintient contrôle Malgré que ça fait de multiples toggles On peut encore re swaper avec les doigts après. Et ça n'est plus bloqué. Je veux dire la correction précédente a au moins corriger ça, c'est à dire que quand on maintient le contrôle à un moment donné, les opérations sont plus bloquées.


Diagnostiqué mécanisme de momentum et orchestré solution temporelle
Diagnostiqué mécanisme de momentum et orchestré solution temporelle
Ton observation confirme exactement la même tension qu'au tout début de ce fil, delay renouvelé contre delay fixe, simplement retombée du mauvais côté cette fois. Le fichier que tu viens d'envoyer montre précisément pourquoi.

Cause exacte

Dans wheelHandler.ts actuel, l'ordre est :

typescript
if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RESET_DELAY);

if (wheel.triggered) return;
Le renouvellement du timer a lieu avant le retour anticipé sur triggered. Donc même après le toggle, chaque nouvel événement wheel, momentum inclus, continue de repousser ce timer tant qu'il arrive dans la fenêtre du délai.

Le momentum d'un trackpad ne décélère pas de façon parfaitement continue, il a des micro coupures ponctuelles où l'intervalle entre deux événements dépasse le délai court, sans que la traînée soit réellement terminée. Dès qu'une de ces micro coupures survient, le timer se déclenche, resetWheelState remet triggered à false, et les événements de momentum qui suivent recommencent à accumuler depuis zéro. S'ils sont encore assez importants pour dépasser trackpadThreshold, ça redéclenche un toggle. Répété deux ou trois fois pendant la décélération, ça donne la séquence que tu observes.

Ça explique aussi pourquoi relâcher contrôle immédiatement ne toggle qu'une fois : dès que ctrlKey passe à false, le tout premier return de la fonction intercepte tous les événements suivants, momentum compris, donc plus rien n'est traité.

Correction

Le principe : vérifier triggered en tout premier, avant tout renouvellement de timer. Une fois déclenché, plus aucun événement ne peut retoucher au timer tant que le verrou est actif, peu importe les micro coupures. Le timer devient un délai fixe, armé une seule fois au moment du toggle.

Dans wheelHandler.ts, remplace le bloc allant de if (!e.ctrlKey) return; jusqu'à la fin de la fonction :

typescript
  if (!e.ctrlKey) return;

  // Full reset after a genuine pause in wheel activity. Renewed on every
  // event, so a continuous gesture (or its momentum tail) keeps postponing
  // it; only a real stop resets accumulatedX and triggered. This also
  // covers ctrl being released mid-gesture: once ctrl is up, the early
  // return above stops renewing this timeout, so it fires on its own a
  // moment later and cleans up, no separate keyup listener needed.
  if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
  wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RESET_DELAY);

  if (wheel.triggered) return;

  const deltaX = settings.invertTrackpadSwipe ? -e.deltaX : e.deltaX;
  wheel.accumulatedX += deltaX;

  if (Math.abs(wheel.accumulatedX) > settings.trackpadThreshold) {
    toggleIf(wheel.accumulatedX < 0 ? getLeftSplit(plugin.app) : getRightSplit(plugin.app));
    wheel.triggered = true;
    refreshHoverState(e);
  }
}
par :

typescript
  if (!e.ctrlKey) return;

  // Checked first, unconditionally: once triggered, every further event is
  // ignored until the fixed cool-down armed below elapses. Trackpad momentum
  // decays in irregular bursts, sometimes with gaps exceeding a short delay
  // even while the tail is still ongoing, so a lock renewed by "the next
  // event" can still expire mid-momentum and let a residual burst cross the
  // threshold again. Arming the cool-down once, at trigger time, and never
  // renewing it here guarantees a fixed minimum spacing between two toggles
  // regardless of how choppy the event stream is in between.
  if (wheel.triggered) return;

  // Reset an abandoned partial swipe after a pause (fingers moved, then
  // stopped short of the threshold). Renewed on every event during
  // accumulation: here a continuous gesture postponing it is correct.
  if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
  wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RESET_DELAY);

  const deltaX = settings.invertTrackpadSwipe ? -e.deltaX : e.deltaX;
  wheel.accumulatedX += deltaX;

  if (Math.abs(wheel.accumulatedX) > settings.trackpadThreshold) {
    toggleIf(wheel.accumulatedX < 0 ? getLeftSplit(plugin.app) : getRightSplit(plugin.app));
    wheel.triggered = true;
    refreshHoverState(e);

    // Fixed cool-down, armed once here and never renewed while triggered
    // (see the early return above): guarantees a minimum spacing between
    // two toggles, long enough to outlast typical momentum so residual
    // events don't cross the threshold again on their own.
    if (wheel.resetTimeout) clearTimeout(wheel.resetTimeout);
    wheel.resetTimeout = setTimeout(() => resetWheelState(plugin), UI_CONSTANTS.TRACKPAD_RETRIGGER_DELAY);
  }
}
Remplace le JSDoc de resetWheelState par :

typescript
/**
 * Fully resets the trackpad swipe state: clears accumulatedX and triggered,
 * and cancels the pending timeout. Called either after an abandoned partial
 * swipe times out, or once the fixed post-trigger cool-down elapses; see the
 * two setTimeout calls in wheelHandler above.
 */
Dans constants/index.ts, assure toi d'avoir ces deux lignes :

typescript
  TRACKPAD_RESET_DELAY: 80,
  TRACKPAD_RETRIGGER_DELAY: 300
Ce que ça résout et ce qui reste à régler

Une fois déclenché, le verrou dure exactement 300ms, sans exception, quelle que soit l'activité du flux d'événements pendant ce temps. Le flapping rapide que tu observes disparaît, puisqu'aucun réarmement ne peut plus se produire pendant cette fenêtre.

Reste un cas limite : si la traînée de momentum dure plus longtemps que 300ms, un second toggle peut encore se produire une fois le verrou levé, mais espacé d'au moins 300ms du premier, plus jamais une rafale rapprochée. Je n'ai pas de données sur la durée réelle du momentum de ton trackpad, donc 300ms est un point de départ à valider, pas une valeur garantie.

Pour régler précisément

Reprends ta méthode du console log, appliquée cette fois à la branche verrouillée :

typescript
if (wheel.triggered) {
  console.log('[wheel] locked', { deltaX: e.deltaX, t: performance.now() });
  return;
}
Regarde l'écart entre le moment du toggle et le dernier événement dont le delta reste significatif, pas juste résiduel proche de zéro. Cet écart, c'est la valeur à donner à TRACKPAD_RETRIGGER_DELAY. Si un second toggle occasionnel persiste encore au delà de ce que tu juges acceptable après ce réglage, il faudrait basculer vers une détection basée sur l'amplitude du delta plutôt que sur le temps écoulé, mais ce serait prématuré tant que le réglage du délai n'a pas été testé.

Aucun nouveau champ d'état, aucun nouveau listener, main.ts n'est pas concerné. C'est le même mécanisme que celui déjà en place, réordonné et avec un délai correctement dimensionné pour son rôle.
