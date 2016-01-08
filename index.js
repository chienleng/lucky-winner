Contestants = new Mongo.Collection("contestants");

if (Meteor.isClient) {
  Template.picker.helpers({
    contestants: function() {
      return Contestants.find().fetch();
    }
  });

  Template.picker.events({
    'click .contestant a.name': function() {
      var toggle = Contestants.findOne(this._id).playing ? false : true;

      Contestants.update(this._id, {$set: {playing: toggle}});

      if (toggle) {
        $('#'+this._id).removeClass('not-playing');
      } else {
        $('#'+this._id).addClass('not-playing');
      }

      return false;
    },

    'click button.pick': function(event) {
      $(event.currentTarget).prop('disabled', true);
      $('.contestant').removeClass('winner');
      Meteor.call('resetAllPicked', function() {
        var playing = Contestants.find({playing: true}).fetch();
        var slotting = Meteor.setInterval(function() {
          $('.contestant').removeClass('active');
          var item = playing[Math.floor(Math.random()*playing.length)];
          $('#'+item._id).addClass('active');
        }, 150);

        Meteor.setTimeout(function() {
          Meteor.clearInterval(slotting);
          $('.contestant.active').addClass('winner');
          $(event.currentTarget).prop('disabled', false);
        }, 5000);


      });

    },

    'click button.reset': function() {
      $('.contestant').removeClass('winner active not-playing');
      Meteor.call('resetAll');
    },

    'click .add-btn': function() {
      var name = $.trim($('#sprinter-name').val());
      if (name.length > 0) {
        Contestants.insert({
          name: name,
          img: '',
          playing: true,
          colour: '#111',
          picked: false
        });
        $('#sprinter-name').val("")
      }
    },

    'click .remove-me': function() {
      Contestants.remove(this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    resetAllPicked: function() {
       return Contestants.update({}, {$set: {picked: false}}, {multi: true});
    },
    resetAll: function() {
      Contestants.update({}, {$set: {picked: false, playing: true}}, {multi: true});
    }
  });

  Meteor.startup(function() {
    // code to run on server at startup
    if (Contestants.find().count() === 0) {
      Contestants.insert({
        name: 'Steven',
        img: 'steven.jpg',
        playing: true,
        colour: '#111',
        picked: false
      })
      Contestants.insert({
        name: 'Travis',
        img: 'travis.jpg',
        playing: true,
        colour: '#555',
        picked: false
      })
      Contestants.insert({
        name: 'Daniel',
        img: 'daniel.jpg',
        playing: true,
        colour: '#888',
        picked: false
      })
      Contestants.insert({
        name: 'Amir',
        img: 'amir.jpg',
        playing: true,
        colour: '#aaa',
        picked: false
      })
      Contestants.insert({
        name: 'Kedar',
        img: 'kedar.jpg',
        playing: true,
        colour: '#eee',
        picked: false
      })
    }
  });
}
