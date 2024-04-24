# Obsidian Sample Plugin modif

I tried github cli but my release script is better

- using another folder that .osbidian/plugins, so not really depending on a vault. so when doing run dev it's using the env var TEST_VAULT.   
todo: I will maybe add more option to choose this path.  
a script npm run cms copy manifest and styles.css to same destination  

- cms: copy manifest script to TEST_VAULT
- start: npm i + npm run dev
- acp: add commit push
- bacp: build + acp
- test: test in another path (to see...)
- release: make a tag and release
- version better than default one with prompts
  
- todo: tester test



## developpement
(do "npm start" at first or a npm i)
-   `npm start` = npm install + npm run dev
-   `npm run bacp` = npm run build + git add + commit (prompt to enter message) + push
-   `npm run acp` = git add + commit (prompt to enter message) + push
-   `npm run version` = prompt to ask what version (patch(1), minor(2), major(3) or manual entering a version e.g 1.2.0 ). git add commit push on manifest, package, versions
-   `npm run release`= publish a release on github with the actual version and prompt for the release message (multiline inserting some \n). you can overwrite an existing release (after confirmation)
-   `npm run test` = npm run build and then export main.js manifest & styles.css(optional) to a target vault. so you can directly test your plugin on another vault as with Brat.Prompts are guiding you. overwritting files if exists in target.

-   Function **"Console"** with a capital C. All Console.log/debug are automatically switched OFF on production after a npm run build, and ON on developpement after a npm start or run dev