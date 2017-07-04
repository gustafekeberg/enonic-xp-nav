'use strict';
/// <reference path="../../lib/xp/global.ts" />
import { PartController } from '../../lib/xp/part/controller';

const libs = {
	xp: {
		portal:    require('xp/portal'),
		content:   require('xp/content'),
		thymeleaf: require('xp/thymeleaf')
	}
};

const name = 'renderNav';
const type = 'part';
const viewFile = resolve(`${name}.html`);
const xpGetContent = function (key: string) {return libs.xp.content.get({key: key});};
const xpUrl = function (id: string) {return libs.xp.portal.pageUrl({id: id});};
const logga = function (str: any) {log.info(JSON.stringify(str, null, 4));};

export default class ExamplePartController extends PartController {

    constructor(request: any) {
        super(request);
        this.name = name;
        this.type = type;
        this.viewFile = viewFile;
    }
		private getNav() {
			if (this.config.id) return this.config.id;
			else if (this.content.type == app.name + ':nav') return this.content._id;
			return;
		}
		private renderGroup() {
		}
		private renderNav() {
			let id = this.getNav();
			let navObj = id ? xpGetContent(id) : null;

			if (!navObj) return null;
			let data = navObj.data;
			let items = new Nav(data.items).parseItems();

			logga(items);

			return items;
		}
    get() {
      this.model.renderNav = this.renderNav();
      return super.get();
    }

    public static handleRequest(request: any) {
        return new ExamplePartController(request).buildResponse().response;
    }

} // ExamplePartController

class Nav {
	items: any[];
	itemTypes: string[] = ['item', 'group', 'dropdown', 'location', 'divider'] ;
	constructor(public itemList) {
			this.items = itemList;
	}
	private content(id: string, target: string = '_self', title: string = '') {
		if (!id) return;
		let url = xpUrl(id);
		return {
			type: this.itemTypes[0],
			url: url,
			target: target,
			title: title,
		}
	}

	private url(url: string, target: string = '_self', title: string = ''){
		return {
			type: this.itemTypes[0],
			url: url,
			target: target,
			title: title,
		}
	}

	private group(all: any) {
		all.type = this.itemTypes[1];
		return all;
	}

	public parseItems() {
		let itemList = this.items;
		let list = [];
		for (var current of itemList) {
			let selected: string = current._selected;
			let item: any = current[selected];
			let content: any;
			switch (selected) {
				case 'content':
				content = this.content(item.id, item.target, item.title);
				break;
				case 'group':
				content = this.group(item);
				break
				// case 'location':
				// content = this.location(item.);
				case 'url':
				content = this.url(item.url, item.target, item.title);
				break;
			}
			list.push(content);
		}
		return list;
	}
} // Nav

export const get = ExamplePartController.handleRequest;
