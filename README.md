# Jekyll Tabs for GitHub pages

Just vanilla fork from [jekyll-tabs](https://github.com/Ovski4/jekyll-tabs) by [Ovski4](https://github.com/Ovski4) to
solve an issue with impossibility to use non-whitelisted plugins for Jekyll at GitHub pages.

### Installation

Include **tabs.css** and **tabs.js** to your headers, modify at your own taste.

### Create the markup

````
{: .tab-title .tabgroup-test .tab-hide }
🌐 Tab title #1

{: .tab-content .tabgroup-test .tab-hide }
```
Test content for tab #1
```

{: .tab-title .tabgroup-test .tab-hide }
🌐 Tab title #2

{: .tab-content .tabgroup-test .tab-hide }
```
Test content for tab #2
```

{: .tab-title .tabgroup-test .tab-hide }
🌐 Tab title #3

{: .tab-content .tabgroup-test .tab-hide }
```
Test content for tab #3
```
````
