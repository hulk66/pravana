export default function decorate(block) {
  const form = document.createElement('form');
  form.className = 'form-form';
  form.noValidate = true;

  [...block.children].forEach((row) => {
    const [labelCell, inputCell] = row.children;
    const labelText = labelCell?.textContent.trim() || '';
    const existing = inputCell?.querySelector('input, select, textarea');
    const button = inputCell?.querySelector('button');

    if (button) {
      const submit = document.createElement('button');
      submit.type = 'submit';
      submit.textContent = button.textContent;
      submit.className = 'button primary';
      form.append(submit);
      return;
    }

    if (!labelText) return;

    const field = document.createElement('div');
    field.className = 'form-field';

    const id = labelText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = id;

    let input = existing;
    if (!input) {
      input = document.createElement('input');
      input.type = labelText.toLowerCase().includes('email') ? 'email' : 'text';
    }
    input.id = id;
    input.name = input.name || id;
    input.classList.add('form-input');

    field.append(label, input);
    form.append(field);
  });

  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  form.append(status);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const required = [...form.querySelectorAll('[required]')];
    const missing = required.find((input) => !input.value.trim());
    if (missing) {
      missing.focus();
      status.textContent = 'Please fill in the required fields.';
      return;
    }

    const email = form.querySelector('input[type="email"]');
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      email.focus();
      status.textContent = 'Please enter a valid email address.';
      return;
    }

    status.textContent = 'Thanks — this is a demo. No data was sent.';
    form.reset();
  });

  block.textContent = '';
  block.append(form);
}
