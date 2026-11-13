<script>
  import { checkHealth } from './health'
  const appInfo = {
    app: 'app-service-builder-svelte',
    version: '1.0.0',
    framework: 'Svelte 5 with Vite 8',
    deploymentMarker: import.meta.env.VITE_DEPLOYMENT_MARKER ?? 'local',
    buildMarker: import.meta.env.VITE_BUILD_MARKER ?? 'local',
  }

  let count = $state(0)
  let checking = $state(false)
  let health = $state('Check the static health file without leaving this page.')

  async function refreshHealth() {
    checking = true
    health = 'Checking /health.json…'
    try {
      health = await checkHealth()
    } catch {
      health = 'Static health check failed. Retry, or inspect /health.json and your static host configuration.'
    } finally {
      checking = false
    }
  }
  let currentPath = $state(normalizePath(window.location.pathname))

  /** @param {string} path */
  function normalizePath(path) {
    return path.length > 1 ? path.replace(/\/+$/, '') : path
  }

  function syncPath() {
    currentPath = normalizePath(window.location.pathname)
  }

  /**
   * @param {MouseEvent} event
   * @param {string} path
   */
  function navigate(event, path) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    window.history.pushState({}, '', path)
    syncPath()
  }
</script>

<svelte:window onpopstate={syncPath} />

{#if currentPath === '/'}
  <main class="sample-sheet">
    <header class="sample-header">
      <a class="sample-brand" href="/"><img src="/brand/builder.svg" alt="" width="32" height="32" />App Service Builder</a>
      <nav aria-label="Documentation">
        <a href="https://svelte.dev/docs">Svelte documentation</a>
        <a href="https://builder.appservice.azure.com/docs/">App Service Builder documentation</a>
      </nav>
    </header>
    <div class="sample-content">
    <div class="ecosystem-logo"><img src="/brand/svelte.svg" alt="" width="52" height="52" /><span>Svelte</span></div>
    <p class="eyebrow">App Service Builder / Svelte</p>
    <h1>Svelte Vite SPA is running</h1>
    <p>This sample renders in your browser with Svelte and Vite.</p>

    <nav aria-label="Test routes">
      <a
        class="button"
        href="/products/widget-1"
        onclick={(event) => navigate(event, '/products/widget-1')}
      >
        Open the deep route
      </a>
      <button class="secondary" type="button" disabled={checking} onclick={refreshHealth}>
        {checking ? 'Checking health…' : 'Check static health'}
      </button>
      <a href="/version.json">View version JSON</a>
    </nav>
    <p class="health-result" role="status">{health}</p>

    <button class="button" type="button" onclick={() => count += 1}>
      Interaction count: {count}
    </button>

    <section aria-labelledby="deployment-heading">
      <h2 id="deployment-heading">Deployment details</h2>
      <dl>
        <div><dt>Application</dt><dd>{appInfo.app} {appInfo.version}</dd></div>
        <div><dt>Framework</dt><dd>{appInfo.framework}</dd></div>
        <div><dt>Deployment</dt><dd>{appInfo.deploymentMarker}</dd></div>
        <div><dt>Build setting</dt><dd>{appInfo.buildMarker}</dd></div>
      </dl>
    </section>
    <details>
      <summary>Customize this sample</summary>
      <p>In your fork, edit the home page in <code>src/App.svelte</code> and the styles in
        <code> public/brand/family.v1.css</code>. Commit your changes and deploy your fork through your Builder App.</p>
    </details>
    <details>
      <summary>Logo sources &amp; notices</summary>
      <p>Unmodified <a href="https://svelte.dev/">Svelte artwork</a> identifies this framework.
        Svelte is a trademark of its respective owner. App Service Builder uses its supplied
        official mark. No endorsement implied.</p>
    </details>
    </div>
  </main>
{:else if currentPath === '/products/widget-1'}
  <main>
    <p class="eyebrow">Client-side deep-link test</p>
    <h1>Widget 1</h1>
    <p>
      This client-side route proves that navigation and direct requests to a
      nested SPA path work when the host serves the SPA shell.
    </p>
    <nav>
      <a class="button" href="/" onclick={(event) => navigate(event, '/')}>
        Return home
      </a>
    </nav>
  </main>
{:else}
  <main>
    <p class="eyebrow">Client-side 404</p>
    <h1>Page not found</h1>
    <p>
      The static host returned the SPA shell, and the Svelte application handled
      this unknown route.
    </p>
    <nav>
      <a class="button" href="/" onclick={(event) => navigate(event, '/')}>
        Return home
      </a>
    </nav>
  </main>
{/if}
