// Takes transpiled JSX and turns it into a React object which will be rendered on the screen
function createElement(type, props, ...children) {
  console.log(props, children);
  return {
    type,
    props: {
      ...props,
      children: children.map(
        child => (typeof child === 'object' ? child : createTextElement(child)) // Any child that isn't an object (i.e. text) gets treated like a plain text node
      ),
    },
  };
}

// We need to treat text children differently because of how text nodes get treated in the browser
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
  // dom is the newly created node to be inserted into the DOM
  const dom =
    element.type == 'TEXT_ELEMENT'
      ? document.createTextNode('') // Again, we need to treat text nodes differently
      : document.createElement(element.type);

  const isProperty = key => key !== 'children';

  // Any props key that isn't the children array will be used to add attributes to the created element
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });

  // We need to recursively render each child (which could also be a new element)
  // This should eventually form a tree
  element.props.children.forEach(child => render(child, dom));

  // Append the children (or nested children) to the dom node we made
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
