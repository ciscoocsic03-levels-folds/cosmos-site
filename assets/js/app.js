(() => {
  const STORAGE_KEY = 'cosmos_todos_v1';
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const clearBtn = document.getElementById('todo-clear');

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load todos', e);
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function render() {
    const items = load();
    list.innerHTML = '';
    if (items.length === 0) {
      const p = document.createElement('p');
      p.className = 'muted';
      p.textContent = 'No tasks yet — add one above.';
      list.appendChild(p);
      return;
    }
    items.forEach((it, idx) => {
      const li = document.createElement('li');
      const text = document.createElement('div');
      text.className = 'todo-text';
      text.textContent = it.text;
      text.tabIndex = 0;

      const actions = document.createElement('div');
      actions.className = 'todo-actions';

      const edit = document.createElement('button');
      edit.className = 'edit';
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => editItem(idx));

      const del = document.createElement('button');
      del.className = 'del';
      del.textContent = 'Delete';
      del.addEventListener('click', () => deleteItem(idx));

      actions.appendChild(edit);
      actions.appendChild(del);

      li.appendChild(text);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function addItem(text) {
    const items = load();
    items.push({ text: text.trim() });
    save(items);
    render();
  }

  function editItem(index) {
    const items = load();
    const current = items[index];
    const newText = prompt('Edit task', current.text);
    if (newText === null) return;
    items[index].text = newText.trim();
    save(items);
    render();
  }

  function deleteItem(index) {
    const items = load();
    items.splice(index, 1);
    save(items);
    render();
  }

  function clearAll() {
    if (!confirm('Clear all tasks?')) return;
    localStorage.removeItem(STORAGE_KEY);
    render();
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    addItem(v);
    input.value = '';
    input.focus();
  });

  clearBtn.addEventListener('click', clearAll);

  // initial render
  render();

})();