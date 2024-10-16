# Build branch details

#master branch
=> it should be the previous live codes.

#live_copy_branch
=> it should be the current live codes.

#webtest_branch

=> it should be the webtest previous live codes.

#test-prod

=>  it should be the every test server builded codes.

#test-pre-prod

=>  it should be the every test server builded codes with all additional features


#roadmap for build setup

    test server               webtest server                     live server
1.#test-pre-prod  ->  (#test-prod  && #webtest_branch ) -> #live_branch -> #master
