import { toggleAutoHide } from './autoHide.ts';
import { toggleBothSidebars } from './barTools.ts';
import EasytoggleSidebar from './main.ts';

export function registerCommands(plugin: EasytoggleSidebar): void {
	plugin.addCommand({
		id: 'toggle-autohide',
		name: 'Toggle autohide sidebars',
		callback: async () => await toggleAutoHide(plugin)
	});

	plugin.addCommand({
		id: 'toggle-both-sidebars',
		name: 'Toggle both sidebars',
		callback: () => toggleBothSidebars(plugin)
	});
}
