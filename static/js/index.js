/* === todo write === */
/* 달력 날짜 지정 */
document.addEventListener('DOMContentLoaded', () => {
  const datetimeInput = document.getElementById('datetime-input');
  const calendar = document.querySelector('.calendar');

  if (!datetimeInput || !calendar) {
    console.error('Required DOM elements are missing.');
    return;
  }

  let selectedDate = null;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // 캘린더 클릭 이벤트
  calendar.addEventListener('click', (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 중지

    const target = e.target;
    if (target.tagName === 'TD' && !target.classList.contains('disabled')) {
      selectedDate = target.dataset.date;
      highlightSelectedDate(target);
      updateInputValue();

      // 캘린더 닫기
      calendar.style.display = 'none';
    }
  });

  // 입력 필드 클릭 시 캘린더 열기
  datetimeInput.addEventListener('click', (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 중지

    calendar.innerHTML = generateCalendarHTML(currentMonth, currentYear);
    calendar.style.display = 'block';
  });

  // 외부 클릭 시 캘린더 닫기
  document.addEventListener('click', (e) => {
    if (!calendar.contains(e.target) && e.target !== datetimeInput) {
      calendar.style.display = 'none';
    }
  });

  function generateCalendarHTML(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let html = `<div><strong>${monthNames[month]} ${year}</strong></div>`;
    html += '<table><tr>';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
      html += `<th>${day}</th>`;
    });
    html += '</tr><tr>';

    for (let i = 0; i < firstDay; i++) {
      html += '<td></td>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        '0',
      )}-${String(day).padStart(2, '0')}`;
      const date = new Date(dateString);

      const isDisabled = date < today.setHours(0, 0, 0, 0) ? 'disabled' : '';
      html += `<td data-date="${dateString}" class="${isDisabled}">${day}</td>`;

      if ((day + firstDay) % 7 === 0) {
        html += '</tr><tr>';
      }
    }

    html += '</tr></table>';
    return html;
  }

  function updateInputValue() {
    if (selectedDate) {
      datetimeInput.value = selectedDate;
    }
  }

  function highlightSelectedDate(target) {
    const allDates = calendar.querySelectorAll('td');
    allDates.forEach((td) => td.classList.remove('selected'));
    target.classList.add('selected');
  }
});

/*add버튼 클릭시 할일input 하나씩 추가*/
document.addEventListener('DOMContentLoaded', () => {
  const todoAddButton = document.getElementById('todoAdd');
  const todoContentList = document.querySelector('.todo_content');

  // 할 일 추가 기능
  todoAddButton.addEventListener('click', () => {
    // 새로운 <li> 요소 생성
    const newListItem = document.createElement('li');
    const newLabel = document.createElement('label');

    // 체크박스 생성
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.name = 'todoChk';

    // 텍스트 입력 필드 생성
    const newTextInput = document.createElement('input');
    newTextInput.type = 'text';
    newTextInput.name = 'todoCon';
    newTextInput.placeholder = '할일을 입력하세요';

    // 삭제 버튼 생성
    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'delete';

    // 삭제 버튼 클릭 이벤트 추가
    deleteButton.addEventListener('click', () => {
      newListItem.remove(); // 부모 <li> 삭제
      updateDeleteButtons(); // 삭제 버튼 상태 업데이트
    });

    // <label>에 요소 추가
    newLabel.appendChild(newCheckbox);
    newLabel.appendChild(newTextInput);
    newLabel.appendChild(deleteButton);

    // <li>에 <label> 추가
    newListItem.appendChild(newLabel);

    // .todo_content에 새 <li> 추가
    todoContentList.appendChild(newListItem);

    // 삭제 버튼 상태 업데이트
    updateDeleteButtons();
  });

  // 삭제 버튼 상태 업데이트 함수
  function updateDeleteButtons() {
    const listItems = todoContentList.querySelectorAll('li');
    listItems.forEach((li, index) => {
      const deleteButton = li.querySelector('input[type="button"]');
      if (listItems.length === 1) {
        // 하나만 남아 있으면 삭제 버튼 숨김
        deleteButton.style.display = 'none';
      } else {
        // 두 개 이상이면 삭제 버튼 보임
        deleteButton.style.display = 'inline-block';
      }
    });
  }

  // 초기 삭제 버튼 상태 설정
  updateDeleteButtons();

  // 기존 삭제 버튼 이벤트 (초기 HTML에 있는 요소)
  todoContentList.addEventListener('click', (e) => {
    if (e.target.type === 'button' && e.target.value === 'delete') {
      const listItem = e.target.closest('li'); // 부모 <li> 찾기
      if (listItem) {
        listItem.remove(); // <li> 삭제
        updateDeleteButtons(); // 삭제 버튼 상태 업데이트
      }
    }
  });
});

/* == popup == */
const pop = document.querySelector('.popup');
const popBtn = document.querySelector('.pop_btn');
const popClose = document.querySelector('.pop_close');
popBtn.addEventListener('click', () => {
  pop.classList.add('on');
  document.querySelector('body').classList.add('pop_open');
});
popClose.addEventListener('click', () => {
  pop.classList.remove('on');
  document.querySelector('body').classList.remove('pop_open');
});
