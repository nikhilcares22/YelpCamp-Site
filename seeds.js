var mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment')

var data = [{
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis nemo quasi ab a inventore voluptatum labore. Voluptate, ex autem! Velit vitae nesciunt nemo mollitia autem vero, officia ex aspernatur unde, beatae veritatis rem magnam accusantium quibusdam eos error ipsum? Minima enim reiciendis, officiis eligendi beatae soluta nostrum deserunt ex aliquam praesentium sunt et quo! Inventore in, dolore praesentium atque natus ab nemo cupiditate totam quisquam molestiae quis doloremque eaque velit officia tenetur, autem explicabo fugit beatae consequatur dolores blanditiis repellendus. Excepturi est, minus recusandae consequuntur dolor possimus aliquid nisi eum harum incidunt dolorem fugiat eligendi suscipit, quas amet molestias alias voluptatem sequi? Ut amet distinctio, illo vel ipsa eligendi architecto magnam id repudiandae incidunt error commodi nisi odio magni minus quibusdam ullam quam voluptas numquam? Soluta eaque aspernatur est velit impedit eligendi at neque omnis rem ducimus. Exercitationem, dolorum repellendus officiis debitis aliquid necessitatibus amet doloribus voluptatem! Ratione, fugit culpa?"
    },
    {
        name: "Desert Mexica",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis nemo quasi ab a inventore voluptatum labore. Voluptate, ex autem! Velit vitae nesciunt nemo mollitia autem vero, officia ex aspernatur unde, beatae veritatis rem magnam accusantium quibusdam eos error ipsum? Minima enim reiciendis, officiis eligendi beatae soluta nostrum deserunt ex aliquam praesentium sunt et quo! Inventore in, dolore praesentium atque natus ab nemo cupiditate totam quisquam molestiae quis doloremque eaque velit officia tenetur, autem explicabo fugit beatae consequatur dolores blanditiis repellendus. Excepturi est, minus recusandae consequuntur dolor possimus aliquid nisi eum harum incidunt dolorem fugiat eligendi suscipit, quas amet molestias alias voluptatem sequi? Ut amet distinctio, illo vel ipsa eligendi architecto magnam id repudiandae incidunt error commodi nisi odio magni minus quibusdam ullam quam voluptas numquam? Soluta eaque aspernatur est velit impedit eligendi at neque omnis rem ducimus. Exercitationem, dolorum repellendus officiis debitis aliquid necessitatibus amet doloribus voluptatem! Ratione, fugit culpa?"
    },
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis nemo quasi ab a inventore voluptatum labore. Voluptate, ex autem! Velit vitae nesciunt nemo mollitia autem vero, officia ex aspernatur unde, beatae veritatis rem magnam accusantium quibusdam eos error ipsum? Minima enim reiciendis, officiis eligendi beatae soluta nostrum deserunt ex aliquam praesentium sunt et quo! Inventore in, dolore praesentium atque natus ab nemo cupiditate totam quisquam molestiae quis doloremque eaque velit officia tenetur, autem explicabo fugit beatae consequatur dolores blanditiis repellendus. Excepturi est, minus recusandae consequuntur dolor possimus aliquid nisi eum harum incidunt dolorem fugiat eligendi suscipit, quas amet molestias alias voluptatem sequi? Ut amet distinctio, illo vel ipsa eligendi architecto magnam id repudiandae incidunt error commodi nisi odio magni minus quibusdam ullam quam voluptas numquam? Soluta eaque aspernatur est velit impedit eligendi at neque omnis rem ducimus. Exercitationem, dolorum repellendus officiis debitis aliquid necessitatibus amet doloribus voluptatem! Ratione, fugit culpa?"
    },
]

function seedDB() {
    //REMOVE ALL THE CAMPGROUNDS
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({}, (err) => {
            if (err) {
                console.log(err)
            } else {
                //ADD A FEW  CAMPGROUNDS

                data.forEach((seed) => {

                    Campground.create(seed, (err, campground) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //ADD A FEW  COMMENTS
                            Comment.create({
                                text: "This place is great, but i wish there is internet",
                                author: "Homer"
                            }, (err, comment) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                }
                            })
                        }
                    });

                });

            }
        })


    });
}









module.exports = seedDB;