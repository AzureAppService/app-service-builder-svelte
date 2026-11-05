<script>
  const appInfo = {
    app: 'app-service-builder-svelte',
    version: '1.0.0',
    framework: 'Svelte 5 with Vite 8',
    deploymentMarker: import.meta.env.VITE_DEPLOYMENT_MARKER ?? 'local',
    buildMarker: import.meta.env.VITE_BUILD_MARKER ?? 'local',
  }

  let count = $state(0)
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
  <main>
    <p class="eyebrow">App Service Builder / Svelte</p>
    <h1>Svelte Vite SPA is running</h1>
    <p>This page was rendered by Svelte from a production Vite static bundle.</p>

    <nav aria-label="Test routes">
      <a
        class="button"
        href="/products/widget-1"
        onclick={(event) => navigate(event, '/products/widget-1')}
      >
        Open the deep route
      </a>
      <a href="/health.json">View static health</a>
      <a href="/version.json">View version metadata</a>
    </nav>

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
