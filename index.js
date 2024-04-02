// Takes transpiled JSX and turns it into a React object which will be rendered on the screen
function createElement(type, props, ...children) {
  console.log(props, children);
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  // TODO: Create DOM nodes
  const dom =
    element.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type);

  const isProperty = key => key !== 'children';

  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach(child => render(child, dom));

  container.appendChild(dom);
}

// This is our library
const Didact = {
  createElement,
  render,
};

const element = Didact.createElement(
  'div',
  { id: 'foo' },
  Didact.createElement(
    'a',
    { href: 'https://google.com', target: '_blank' },
    'Google'
  ),
  Didact.createElement('p', null, 'baz')
);

const element2 = Didact.createElement('p', { className: 'tacoShell' }, 'Tacos');
const element3 = Didact.createElement(
  'ul',
  null,
  Didact.createElement('li', null, 'Lettuce'),
  Didact.createElement('li', null, 'Tomato')
);

const container = document.getElementById('root');
Didact.render(element, container);
Didact.render(element2, container);
Didact.render(element3, container);
