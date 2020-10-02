import '@styles/style.css';
import '@styles/scss.scss';

const obj = {
  name: 'Vasiliy',
};

const { name } = obj;

function foo(params) {
  const lastname = params;

  return lastname;
}

// eslint-disable-next-line no-console
console.log('test: ', foo(name));
