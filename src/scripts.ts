export type Disposer = () => void;

export function isLoadScriptSupports() {
  return !!document;
}

export function loadScript(url: string): Promise<void> {
  if (!isLoadScriptSupports()) {
    return Promise.reject('load-script-not-supported');
  }

  return new Promise<void>((res, rej) => {
    const exists = document.querySelector(`script[src='${url}']`);

    if (exists) {
      console.log(`SCRIPT ${url} was cached`);
      return res();
    }

    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      res();
    };

    script.onerror = () => {
      rej('onerror');
    };

    document.head.append(script);
  });
}


export async function loadStyle(url: string): Promise<Disposer> {
  if (!isLoadScriptSupports()) return () => { };

  // already loaded
  if (document.querySelector(`link[href="${url}"]`)) return () => { };

  const linkElement = document.createElement('link');

  linkElement.rel = 'stylesheet';
  linkElement.type = 'text/css';
  linkElement.href = url;

  document.head.appendChild(linkElement);

  return () => linkElement.remove();
}
