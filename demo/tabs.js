/**
 * Configure the tabs behavior.
 */
const jekyllTabsConfiguration = {
    syncTabsWithSameLabels: false,
    addCopyToClipboardButton:  true,
    copyToClipboardButtonHtml: '<button class="btn btn-primary btn-small" style="cursor:pointer;" title="Copy">📋</button>',
};

const jekyllTabsModule = (function() {

    /**
     * Remove all "active" classes on li elements that belong to the given ul element.
     */
    const removeActiveClasses = function (ulElement) {
        const liElements = ulElement.querySelectorAll('ul > li');

        Array.prototype.forEach.call(liElements, function(liElement) {
            liElement.classList.remove('active');
        });
    }

    /**
     * Get the element position looking from the perspective of the parent element.
     *
     * Considering the following html:
     *
     * <ul>
     *   <li class="zero">0</li>
     *   <li class="one">1</li>
     *   <li class="two">2</li>
     * </ul>
     *
     * Then getChildPosition(document.querySelector('.one')) would return 1.
     */
    const getChildPosition = function (element) {
        var parent = element.parentNode;
        var i = 0;

        for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === element) {
                return i;
            }
        }

        throw new Error('No parent found');
    }

    /**
     * Returns a list of elements of the given tag that contains the given text.
     */
    const findElementsContaining = function(elementTag, text) {
        const elements = document.querySelectorAll(elementTag);
        const elementsThatContainText = [];

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            if (element.textContent.includes(text)) {
                elementsThatContainText.push(element);
            }
        }

        return elementsThatContainText;
    }

    /**
     * Handle adding or removing active classes on tab list items.
     */
    const handleTabClicked = function(link) {
        liTab = link.parentNode;
        ulTab = liTab.parentNode;
        liPositionInUl = getChildPosition(liTab);

        if (liTab.className.includes('active')) {
            return;
        }

        tabContentId = ulTab.getAttribute('data-tab');
        tabContentElement = document.getElementById(tabContentId);

        // Remove all "active" classes first.
        removeActiveClasses(ulTab);
        removeActiveClasses(tabContentElement);

        // Then add back active classes depending on the tab (ul element) that was clicked on.
        tabContentElement.querySelectorAll('ul > li')[liPositionInUl].classList.add('active');
        liTab.classList.add('active');
    }

    /**
     * Create a javascript element from html markup.
     */
    const createElementFromHtml = function(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();

        return template.content.firstChild;
    }

    /**
     * Copy the given text in the clipboard.
     *
     * See https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
     */
    const copyToClipboard = function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            // Use the 'out of viewport hidden text area' trick
            const textArea = document.createElement("textarea");
            textArea.value = text;

            // Move textarea out of the viewport so it's not visible
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";

            document.body.prepend(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
            } catch (error) {
                console.error(error);
            } finally {
                textArea.remove();
            }
        };
    }

    return {
        findElementsContaining,
        handleTabClicked,
        createElementFromHtml,
        copyToClipboard,
    };

})();

window.addEventListener('load', function () {
    /**
     * Vanilize our tabs to get them work with GitHub pages 
     * All you need is to make 2 paragraphs with classes:
     * 1. Tabs: {: .tab-title .tabgroup-groupname .tab-hide }
     * 2. Content: {: .tab-content .tabgroup-groupname .tab-hide }
     * User different identifiers instead of "groupname" to group tabs on a page
     */
    const tabVanilla = document.querySelectorAll('p.tab-title');
    const tabGroups = [];
    for(let i = 0; i < tabVanilla.length; i++) {
        var tabElement = tabVanilla[i];
        var cList = tabElement.classList;

        cList.forEach(function(value, key, listObj) {
           var tmp = value.split("-");
           if (tmp[0] == "tabgroup" && tmp.length > 1 && tabGroups.indexOf(tmp[1]) === -1) {
               tabGroups.push(tmp[1]);
           }
        }, "arg");
    }

    for(let i = 0; i < tabGroups.length; i++) {
        var id = tabGroups[i];
        var nodes = document.querySelectorAll('p.tab-title.tabgroup-'+id);
        var first = nodes[0];

        var tabGroup = document.createElement("div");
        tabGroup.id = 'tab-block-' + id;

        var tabContentId = 'tab-content-' + id;
        var tabTitlesUl = document.createElement("ul");
        tabTitlesUl.classList.add('tab');
        tabTitlesUl.setAttribute('data-tab', tabContentId);

        for(let j = 0; j < nodes.length; j++) {
            var titleElement = nodes[j];
            var tabTitlesLi = document.createElement("li");
            if (j == 0) {
                tabTitlesLi.classList.add('active');
            }
            tabTitlesLi.setHTML('<a href="#" title="' + titleElement.innerHTML + '">' + titleElement.innerHTML + '</a>');
            tabTitlesUl.append(tabTitlesLi);
        }
        tabGroup.append(tabTitlesUl);

        var nodes = document.querySelectorAll('div.tab-content.tabgroup-'+id);
        var tabContentUl = document.createElement("ul");
        tabContentUl.classList.add('tab-content');
        tabContentUl.id = tabContentId;
        for(let j = 0; j < nodes.length; j++) {
            var contentElement = nodes[j];
            var contentTitlesLi = document.createElement("li");
            if (j == 0) {
                contentTitlesLi.classList.add('active');
            }
            contentTitlesLi.setHTML(contentElement.innerHTML);
            tabContentUl.append(contentTitlesLi);
        }
        tabGroup.append(tabContentUl);

        first.parentNode.insertBefore(tabGroup, first);
    } //

    for(let i = 0; i < tabGroups.length; i++) {
        var nodes = document.querySelectorAll('p.tab-title.tabgroup-'+id);
        for(let j = 0; j < nodes.length; j++) {
            nodes[j].remove();
        }

        var nodes = document.querySelectorAll('div.tab-content.tabgroup-'+id);
        for(let j = 0; j < nodes.length; j++) {
            nodes[j].remove();
        }
    }

    const tabLinks = document.querySelectorAll('ul.tab > li > a');

    Array.prototype.forEach.call(tabLinks, function(link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            jekyllTabsModule.handleTabClicked(link);

            if (jekyllTabsConfiguration.syncTabsWithSameLabels) {
                const linksWithSameName = jekyllTabsModule.findElementsContaining('a', link.textContent);

                for(let i = 0; i < linksWithSameName.length; i++) {
                    if (linksWithSameName[i] !== link) {
                        jekyllTabsModule.handleTabClicked(linksWithSameName[i]);
                    }
                }
            }
        }, false);
    });

    if (jekyllTabsConfiguration.addCopyToClipboardButton) {
        const preElements = document.querySelectorAll('ul.tab-content > li pre');

        for(let i = 0; i < preElements.length; i++) {
            const preElement = preElements[i];
            const preParentNode = preElement.parentNode;
            const button = jekyllTabsModule.createElementFromHtml(jekyllTabsConfiguration.copyToClipboardButtonHtml);

            preParentNode.style.position = 'relative';
            button.style.position = 'absolute';
            button.style.top = '-15px';
            button.style.right = '-15px';

            preParentNode.appendChild(button);

            button.addEventListener('click', function () {
                jekyllTabsModule.copyToClipboard(preElement.innerText);
            });
        }
    }

});
