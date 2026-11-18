export default function decorate(block) {
  const rows = [...block.children];
  const form = document.createElement('form');
  form.className = 'form-form';
  form.noValidate = true;

  rows.forEach((row) => {
    const cells = [...row.children];
    const labelText = cells[0]?.textContent.trim() || '';
    const type = (cells[1]?.textContent.trim() || 'text').toLowerCase();
    const required = (cells[2]?.textContent.trim() || '').toLowerCase() === 'required';
    const placeholder = cells[3]?.textContent.trim() || '';

    if (type === 'submit') {
      const submit = document.createElement('button');
      submit.type = 'submit';
      submit.textContent = labelText || 'Submit';
      submit.className = 'button primary';
      form.append(submit);
      return;
    }

    if (!labelText) return;

    const id = labelText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const field = document.createElement('div');
    field.className = 'form-field';

    if (type === 'checkbox') {
      field.classList.add('form-checkbox');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = id;
      input.name = id;
      input.required = required;

      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = labelText;

      field.append(input, label);
    } else {
      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = labelText;

      const input = document.createElement('input');
      input.type = type;
      input.id = id;
      input.name = id;
      input.required = required;
      input.placeholder = placeholder;
      input.className = 'form-input';

      field.append(label, input);
    }

    form.append(field);
  });

  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  form.append(status);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const required = [...form.querySelectorAll('[required]')];
    const missing = required.find((input) => (input.type === 'checkbox' ? !input.checked : !input.value.trim()));
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
