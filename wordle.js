var WORDS = null

const getLetterClass = function(word, _char, i) {
  let cls = 'bg-secondary'
  if (word[i] == _char) {
    cls = 'bg-success'
  } else if (word.includes(_char)) {
    cls = 'bg-warning'
  }
  return cls
}

class Char {
  constructor(letter = '', keytype='grid') {
    this.letter = letter
    this.cls = keytype == 'grid' ? ['col-1', 'border', 'border-dark', 'rounded', 'mx-1'] : ['bg-muted', 'border-0', 'm-1', 'p-3', 'rounded']
    this._clues = []
  }

  addClass(cls) {
    if (!(this._clues.includes(cls))) {this._clues.push(cls)}
  }

  get classes() {
    return this.cls.join(' ') + ' ' + this._clues.join(' ')
  }
}

let app = new Vue({
  el: "#app",
  data: {
    grid: [
      [new Char(), new Char(), new Char(), new Char(), new Char()],
      [new Char(), new Char(), new Char(), new Char(), new Char()],
      [new Char(), new Char(), new Char(), new Char(), new Char()],
      [new Char(), new Char(), new Char(), new Char(), new Char()],
      [new Char(), new Char(), new Char(), new Char(), new Char()],
      [new Char(), new Char(), new Char(), new Char(), new Char()],
    ],
    keyrow1: Array.from("QWERTYUIOP").map(letter => new Char(letter, 'key')),
    keyrow2: Array.from("ASDFGHJKL").map(letter => new Char(letter, 'key')),
    keyrow3: Array.from("ZXCVBNM").map(letter => new Char(letter, 'key')),
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
      let letter = evt.target.innerText
      this.keys.push(letter)
      this.grid[this.row][this.col].letter = letter
      this.col += 1
    },
    enter() {
      let row = this.grid[this.row]
      let word = this.word
      let keyrows = this.keyrow1.concat(this.keyrow2).concat(this.keyrow3)
      let attempt = this.keys
      attempt.forEach(function(_char, i) {
        // Locate the char object
        let charobj = row[i]
        let cls = getLetterClass(word, charobj.letter, i)
        charobj.addClass(cls)
      })
      this.keys.forEach(function(_char, i) {
        let charobj = keyrows.find((c) => c.letter == _char)
        let cls = getLetterClass(word, _char, i)
        charobj.addClass(cls)
      })
      if (this.word == this.keys.join('')) {
        alert('You win!')
        window.location.reload()
      }
      this.row += 1
      this.col = 0
      this.keys = []
    },
    backspace() {
      this.keys.pop()
      this.col -= 1
      this.grid[this.row][this.col] = new Char()
    }
  }
})
