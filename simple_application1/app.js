
(function () {
    'use strict';

    var Quiz = React.createClass({
      propTypes: {
          data: React.PropTypes.array.isRequired
      },
      getInitialState: function () {
          return _.extend({
              bgClass: 'neutral',
              showContinue: false
          }, this.props.data.selectGame());
      },
      handleBookSelected: function (title) {
          var isCorrect = this.state.checkAnswer(title);
          this.setState({
              bgClass: isCorrect ? 'pass' : 'fail',
              showContinue: isCorrect
          });
      },
      handleContinue: function () {
          this.setState(this.getInitialState());
      },
      render: function () {
          return (<div>
                <div className="row">
                  <div className="col-md-4">
                    <img src={this.state.author.imageUrl} className="authorimage"/>
                  </div>
                  <div className="col-md-7">
                      {this.state.books.map(function (b) {
                          return <Book onBookSelected={this.handleBookSelected} title={b} />;
                      }, this)}
                  </div>
                  <div className={"col-md-1" + " " + this.state.bgClass}></div>
                </div>
                {this.state.showContinue ? (
                  <div className="row">
                    <div className="col-md-12">
                        <input onClick={this.handleContinue} type="button" className="btn btn-primary" value="continue"/>
                    </div>
                  </div>
                ) : <span/>
              }
            </div>
            );
      }
    });

    var Book = React.createClass({
      propTypes: {
          title: React.PropTypes.string.isRequired
      },
      handleClick: function () {
        this.props.onBookSelected(this.props.title);
      },
      render: function () {
          return <div onClick={this.handleClick} className="answer">
                    <h4> {this.props.title} </h4>
                </div>;
      }
    });

    var data = [
      {
         name: "Mark Twain",
         imageUrl: 'images/marktwain.jpeg',
         books: ['The Adventures of Huckleberry Finn']
      },
      {
         name: "Joseph Conrad",
         imageUrl: 'images/josephconrad.jpeg',
         books: ['Heart of Darkness']
      },
      {
         name: "J.K. Rowling",
         imageUrl: 'images/jkrowling.jpeg',
         books: ['Harry Potter and the Sorcerers Stone']
      },
      {
         name: "Stephen King",
         imageUrl: 'images/stephenking.jpeg',
         books: ['The Shining', 'IT']
      },
      {
         name: "Charles Dickens",
         imageUrl: 'images/charlesdickens.jpeg',
         books: ['David Copperfield', 'A Tale of Two Cities']
      },
      {
         name: "William Shakespeare",
         imageUrl: 'images/shakespeare.jpeg',
         books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
      }
    ];


    function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
    }

    function randomInt(min, max) {
      return Math.floor(Math.random()*(max-min+1)) + min ;
    }

    data.selectGame = function () {
      var books = shuffle(
        this.reduce(function (x, y) {
          return x.concat(y.books);
        }, [])).slice(0,4);

      var answer = books[randomInt(0, books.length-1)];

      return {
        books: books,
        author: _.find(this, function (author) {
            return author.books.some(function (title) {
               return title === answer;
            });
        }),
        // checkAnswer fun is defined the same scope as the selceted author, so it has access to the author variable
        // why this inner function can be  called outisde the outer func
        checkAnswer: function (title) {
           return this.author.books.some(function (t) {
              return t === title;
           });
        }
      };
    }


    ReactDOM.render(
      <Quiz data={data} />,
      document.getElementById('app')
    );
})();
