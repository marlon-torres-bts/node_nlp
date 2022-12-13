let typingTimer;
let doneTypingInterval = 500;
let myInput = document.getElementById('myInput');

const submitReview = (e) => {
  e.preventDefault();
  const review = document.getElementById('review').value;
  const options = {
    method: 'POST',
    body: JSON.stringify({ review }),
    headers: new Headers({ 'Content-Type': 'application/json' })
  }

  const emojiSection = document.getElementById('emojiSection');
  const title = document.getElementById('title');
  const outline = document.querySelector(':focus');

  fetch('/api/nlp/s-analyzer', options)
    .then(res => res.json())
    .then (({ hasBadWords }) => {
      console.log('hei: ', hasBadWords);

      if (hasBadWords) {
        emojiSection.innerHTML = '<img src="https://images.emojiterra.com/twitter/v13.1/512px/1f620.png">';
        title.style.color = 'red';
        outline.style.borderColor = 'red';
      } else {
        emojiSection.innerHTML = '<img src="https://img.icons8.com/color/96/000000/happy.png">';
        title.style.color = 'green';
        outline.style.borderColor = 'green'
      }
      // if (analysis === 0) {
      //   emojiSection.innerHTML = '<img src="https://img.icons8.com/officel/80/000000/neutral-emoticon.png">';
      //   title.style.color = '#00367c';
      //   outline.style.borderColor = '#00367c';
      // }
    //  else {
    //     emojiSection.innerHTML = '<img src="https://img.icons8.com/color/96/000000/happy.png">';
    //     title.style.color = 'green';
    //     outline.style.borderColor = 'green'
    //   }
    })
    .catch(err => {
      console.log(err)
      emojiSection.innerHTML = 'There was an error processing your request!'
    })
}

document.getElementById('reviewForm').addEventListener('submit', submitReview);
