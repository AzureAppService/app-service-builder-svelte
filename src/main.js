import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const target = document.getElementById('app')

if (!target) {
  throw new Error('Missing Svelte application root element.')
}

const app = mount(App, {
  target,
})

export default app
