import { html } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'

export const Loading = isBlock => isBlock
  ? html`<article><span class="reference">loading...</span></article>`
  : html`<span class="reference">loading...</span>`
