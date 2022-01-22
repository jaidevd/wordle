var WORDS = null

const annotateGrid = function(row, word) {
  row.forEach(function(el, i) {

    el.classList.remove('bg-success')
    el.classList.remove('bg-warning')
    el.classList.remove('bg-secondary')
    el.classList.remove('text-white')

    el.classList.add("text-white")
    let letter = el.innerText
    let cls = "bg-secondary"
    if (word[i] == letter) {
      cls = 'bg-success'
    } else if (word.includes(letter)) {
      cls = 'bg-warning'
    }
    el.classList.add(cls)
  })
}

const clearCell = function(row, col) {
  let el = document.querySelectorAll('.col-1')[row * 5 + col]
  el.innerText = ''
  el.classList.remove('bg-success')
  el.classList.remove('bg-warning')
  el.classList.remove('bg-secondary')
  el.classList.remove('text-white')
}


let app = new Vue({
  el: "#app",
  data: {
    grid: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ],
    keyrow1: Array.from("QWERTYUIOP"),
    keyrow2: Array.from("ASDFGHJKL"),
    keyrow3: Array.from("ZXCVBNM"),
    word: '',
    row: 0,
    col: 0,
    keys: []
  },
  mounted: function() {
    fetch('words.json').then(resp => resp.json()).then(words => {
      WORDS = words
      let ix = Math.floor(Math.random() * words.length)
      this.word = words[ix].toUpperCase()
    })
  },
  methods: {
    playLetter(evt) {
      if (this.col>=5 || this.row >=6) {
        return
      }
      this.keys.push(evt.target)

      // Find the rendered cell
      let cell = document.querySelectorAll('.col-1')[this.row * 5 + this.col]
      cell.innerText = letter
      this.col += 1
    },
    enter() {
      let start = app.row * 5
      let end = start + app.col
      let row = Array.from(document.querySelectorAll('.col-1')).slice(start, end)
      annotateGrid(row, this.word)
      annotateGrid(this.keys, this.word)
      this.row += 1
      this.col = 0
      this.keys = []
    },
    backspace() {
      this.keys.pop()
      this.col -= 1
      clearCell(this.row, this.col)
    }
  }
})

