// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = string;
  export interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [elemName: string]: any;
  }
}

export function createElement(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: { [id: string]: any },
  ...content: string[]
) {
  if (typeof name === 'string') {
    props = props || {};
    const propsstr = Object.keys(props)
      .map((key) => {
        const value = props[key];
        if (key === 'className') return `class=${value}`;
        else return `${key}=${value}`;
      })
      .join(' ');

    return content.length === 0
      ? `<${name} ${propsstr}/>`
      : `<${name} ${propsstr}>${content.join('')}</${name}>`;
  } else if (typeof name === 'function') {
    return name(props, ...content);
  } else {
    return content.join('');
  }
}
