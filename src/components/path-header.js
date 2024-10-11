import { html, when } from "chrome://global/content/vendor/lit.all.mjs";
import { MozLitElement } from "chrome://global/content/lit-utils.mjs";

class PathPart extends MozLitElement {
	static properties = {
		divider: { type: Boolean },
		path: { type: String },
		name: { type: String },
	};

	/**
	 * @todo Maybe don't define this for each element
	 */
	connectedCallback() {
		super.connectedCallback();
		this.selectedDeck = document.querySelector("view-dir[slot='selected']");
	}

	onClick() {
		this.selectedDeck.setAttribute("path", this.path);
	}

	render() {
		return html`
			<moz-button
				size="small"
				@click=${this.onClick}
			>${this.name}</moz-button>
			${when(this.divider, () => html`<span class="divider">/</span>`)}
		`;
	}
}

customElements.define("path-part", PathPart);

class PathHeader extends MozLitElement {
	static properties = {
		path: { type: String, reflect: true },
	};

	render() {
		let { path } = this;
		let i = 0;
		// 1 for /
		const length = PathUtils.split(path).length - 1;
		const dirs = [];

		while (path) {
			const divider = i !== 0 && i !== length;
			const fileName = PathUtils.filename(path);
			if (!path) {
				continue;
			}

			i++;
			dirs.unshift({ divider, path, fileName, i });
			path = PathUtils.parent(path);
		}

		// Wrap this in a <div>, since .sticky-container is a flexbox with a gap.
		return html`
			<div>
				${dirs.map(
					({ divider, path, fileName }) => html`
						<path-part
							.divider=${divider}
							.path=${path}
							.name=${fileName}
						></path-part>
					`,
				)}
			</div>
		`;
	}
}

customElements.define("path-header", PathHeader);
