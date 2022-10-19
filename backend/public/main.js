// <script src="vue.js"></script>
// <script src="main.js"></script>

function getParam(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  return ''
}

let host = 'https://fcc510c1.ngrok.io'

let resultApp = new Vue({
  el: '#features17-4',
  data () {
    return {
      results: []
    }
  },
  methods: {
    getContent (node) {
      if (node.versions.length === 1 || node.versions[0].approved)
        return node.versions[0]
      return node.versions[1]
    },
    getDate(d) {
      return moment(d).fromNow()
    },
    open (node) {
      if (node.versions.length === 1 || node.versions[0].approved) {
        window.open(`${host}/uploads?_id=${node.versions[0]._id}`, '_blank')
      } else {
        window.open(`${host}/uploads?_id=${node.versions[1]._id}`, '_blank')
      }
    }
  }
})

let searchApp = new Vue({
  el: '#form3-1',
  mounted () {
    this.searchText = getParam('s')
    if (this.searchText) this.search()
  },
  data () {
    return {
      searchText: ''
    }
  },
  methods: {
    async search () {
      let result = await axios.get(host + '/opendata?s=' + this.searchText)
      resultApp.results = result.data.data
      setTimeout( function () {
        document.getElementById('features17-4').scrollIntoView({ block: 'start', behavior: 'smooth' })
        console.log(result.data)
      }, 500)
      
    }
  }
})