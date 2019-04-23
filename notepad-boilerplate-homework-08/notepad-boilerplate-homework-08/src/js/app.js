'use strict';

class Notepad {
  constructor(notes) {
    this._notes = notes;
  }

  get notes() {
    return this._notes;
  }

  static Priority = {
    LOW: 0,
    NORMAL: 1,
    HIGH: 2,
  };

  findNoteById(id) {
    return this._notes.find(note => note.id === id);
  }

  saveNote(note) {
    this._notes.push(note);
    return note;
  }

  deleteNote(id) {
    this._notes = this._notes.filter(note => note.id !== id);
  }

  updateNoteContent(id, updatedContent) {
    const note = this.findNoteById(id);
    Object.assign(note, updatedContent);
    return note;
  }
  updateNotePriority(id, priority) {
    const note = this.findNoteById(id);
    note.priority = priority;
    return note;
  }
  filterNotesByQuery(query) {
    return this._notes.filter(note => {
      const inTitle = note.title.toLowerCase().includes(query);
      const inBody = note.body.toLowerCase().includes(query);
      return inTitle || inBody;
    });
  }

  filterNotesByPriority(priority) {
    return this._notes.filter(note => note.priority === priority);
  }
}

const PRIORITY_TYPES = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
};

const ICON_TYPES = {
  EDIT: 'edit',
  DELETE: 'delete',
  ARROW_DOWN: 'expand_more',
  ARROW_UP: 'expand_less',
};

const NOTE_ACTIONS = {
  DELETE: 'delete-note',
  EDIT: 'edit-note',
  INCREASE_PRIORITY: 'increase-priority',
  DECREASE_PRIORITY: 'decrease-priority',
};

const initialNotes = [
  {
    id: 'id-1',
    title: 'JavaScript essentials',
    body:
      'Get comfortable with all basic JavaScript concepts: variables, loops, arrays, branching, objects, functions, scopes, prototypes etc',
    priority: PRIORITY_TYPES.HIGH,
  },
  {
    id: 'id-2',
    title: 'Refresh HTML and CSS',
    body:
      'Need to refresh HTML and CSS concepts, after learning some JavaScript. Maybe get to know CSS Grid and PostCSS, they seem to be trending.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-3',
    title: 'Get comfy with Frontend frameworks',
    body:
      'First should get some general knowledge about frameworks, then maybe try each one for a week or so. Need to choose between React, Vue and Angular, by reading articles and watching videos.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-4',
    title: 'Winter clothes',
    body:
      "Winter is coming! Need some really warm clothes: shoes, sweater, hat, jacket, scarf etc. Maybe should get a set of sportwear as well so I'll be able to do some excercises in the park.",
    priority: PRIORITY_TYPES.LOW,
  },
];

const notepad = new Notepad(initialNotes);

const list = document.querySelector('.note-list');

renderNoteList(list, notepad.notes);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.note-editor');
  const title = form.querySelector('.js-input-title');
  const body = form.querySelector('.js-input-body');
  const search = document.querySelector('.search-form__input');

  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', deleteNote);
  search.addEventListener('input', filterNotes);

  function handleSubmit(event) {
    event.preventDefault();
    const titleCont = title.value;
    const bodyCont = body.value;

    if (!titleCont || !bodyCont) {
      alert('Необходимо заполнить все поля!');
      return;
    }

    const Note = function({ title, body, priority = 0 }) {
      this.id = generateUniqueId();
      this.title = title;
      this.body = body;
      this.priority = priority;
    };

    const note = new Note({ title: titleCont, body: bodyCont });

    notepad.saveNote(note);
    addListItem(list, note);

    form.reset();
  }

  function deleteNote(event) {
    const el = event.target.closest('[data-action=delete-note]');
    const note = event.target.closest('.note-list__item');

    if (el === null) {
      return;
    }
    removeListItem(note);
  }

  function filterNotes(event) {
    event.preventDefault();

    const target = event.target;

    const value = target.value;
    const filteredNotes = notepad.filterNotesByQuery(value);

    list.innerHTML = '';
    renderNoteList(list, filteredNotes);
  }

});

// renderNoteListNarkup(list, notepad.notes);

function removeListItem(note) {
  notepad.deleteNote(note.dataset.id);
  note.remove();
}

const generateUniqueId = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15);

function addListItem(listRef, note) {
  const newNote = createListItem(note);
  listRef.appendChild(newNote);
}

function renderNoteList(listRef, notes) {
  const res = notes.reduce((acc, el) => acc.concat(createListItem(el)), []);
  if (res) {
    listRef.append(...res);
  }
}

function renderNoteListNarkup(listRef, notes) {
  const res = notes.reduce((acc, el) => acc + createListItemMarkup(el), '');
  if (res) {
    listRef.innerHTML += res;
  }
}

function createListItem(note) {
  const li = document.createElement('li');
  li.classList.add('note-list__item');
  li.dataset.id = note.id;

  const item = document.createElement('div');
  item.classList.add('note');

  const noteContent = createNoteContent(note);
  const noteFooter = createNoteFooter(note);

  li.append(noteContent, noteFooter);

  return li;
}

function createNoteContent(note) {
  const content = document.createElement('div');
  content.classList.add('note__content');

  const title = document.createElement('h2');
  title.classList.add('note__title');
  title.textContent = note.title;

  const body = document.createElement('p');
  body.textContent = note.body;

  content.append(title, body);

  return content;
}

function createNoteFooter(note) {
  const footer = document.createElement('footer');
  footer.classList.add('note__footer');

  const firstSection = document.createElement('section');
  firstSection.classList.add('note__section');

  const btnDecPrior = createActionButton(
    NOTE_ACTIONS.DECREASE_PRIORITY,
    ICON_TYPES.ARROW_DOWN
  );

  const btnIncPrior = createActionButton(
    NOTE_ACTIONS.INCREASE_PRIORITY,
    ICON_TYPES.ARROW_UP
  );

  const span = document.createElement('span');
  span.classList.add('note__priority');
  span.textContent = `Priority: ${note.priority}`;

  firstSection.append(btnDecPrior, btnIncPrior, span);

  const secSection = firstSection.cloneNode();

  const btnEdit = createActionButton(NOTE_ACTIONS.EDIT, ICON_TYPES.EDIT);
  const btnDelete = createActionButton(NOTE_ACTIONS.DELETE, ICON_TYPES.DELETE);

  secSection.append(btnEdit, btnDelete);

  footer.append(firstSection, secSection);

  return footer;
}

function createActionButton(action, text) {
  const button = document.createElement('button');
  button.classList.add('action');
  button.dataset.action = action;

  const i = document.createElement('i');
  i.classList.add('material-icons', 'action__icon');
  i.textContent = text;

  button.appendChild(i);

  return button;
}

function createListItemMarkup(note) {
  return `
  <li class="note-list__item" data-id="${note.id}">
  <div class="note">
    <div class="note__content">
      <h2 class="note__title">${note.title}</h2>
      <p class="note__body">
        ${note.body}
      </p>
    </div>
    <footer class="note__footer">
      <section class="note__section">
        <button class="action" data-action="${NOTE_ACTIONS.DECREASE_PRIORITY}">
          <i class="material-icons action__icon">${ICON_TYPES.ARROW_DOWN}</i>
        </button>
        <button class="action" data-action="${NOTE_ACTIONS.INCREASE_PRIORITY}">
          <i class="material-icons action__icon">${ICON_TYPES.ARROW_UP}</i>
        </button>
        <span class="note__priority">Priority: ${note.priority}</span>
      </section>
      <section class="note__section">
        <button class="action" data-action="${NOTE_ACTIONS.EDIT}">
          <i class="material-icons action__icon">${ICON_TYPES.EDIT}</i>
        </button>
        <button class="action" data-action="${NOTE_ACTIONS.DELETE}">
          <i class="material-icons action__icon">${ICON_TYPES.DELETE}</i>
        </button>
      </section>
    </footer>
  </div>
</li>`;
}
