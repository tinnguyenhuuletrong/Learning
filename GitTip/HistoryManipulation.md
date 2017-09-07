https://rtyley.github.io/bfg-repo-cleaner/

``` bash
git clone --mirror git://example.com/some-big-repo.git
java -jar bfg.jar --delete-files *.a  boboiboy_run.git
```

Note:
	- After Doing this. Exiting client repo should be fresh checkout