var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!　'
    }
})


var app=new Vue({
  el:"#title1",
  data:{
    site_name:'Tribe Factory'
  }
})

var app=new Vue({
  el:"#head1",
  data:{
    site_name:'Tribe Factory'
  }
})



var app2 = new Vue({
    el: '#app-2',
    data: {
      message: 'You loaded this page on ' + new Date().toLocaleString()
    }
})


var app3 = new Vue({
    el: '#app-3',
    data: {
      seen: true
    }
  })




  var value = new Vue({
    el: '#app-4',
    data: function() {
      return({
        items:[
          {
            url: 'https://gtlgqvxdkbh2dm3axzu5fq-on.drv.tw/play_audio_files/play_audio_files.htm',
            text: 'play_audio'
          },
          {
            url: 'https://gtlgqvxdkbh2dm3axzu5fq-on.drv.tw/clock/analogue.htm',
            text: 'clock'
          },
          {
            url: 'https://gtlgqvxdkbh2dm3axzu5fq-on.drv.tw/drum_masters/drum_masters.0.0301.htm',
            text: 'drum_masters'
          }
        ]
      });
    }
  })

  var value = new Vue({
    el: '#app-5',
    data: function() {
      return({
        items:[
          {
            url: 'https://www.youtube.com/c/tribefactory/videos',
            text: 'YouTube'
          },
          {
            url: 'https://qiita.com/NoguchiMasafumi',
            text: 'Qiita'
          },
          {
            url:'https://tribefactory.netlify.app/',
            text:'Netlify homepage'

          }
        ]
      });
    }
  })


  
