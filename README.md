Px-Modal
-----------------------------------------------

## Overview

Px-Modal is a Predix Experience ('Px') component that open a modal window and overlay over the page.

### Attributes

#####modal-id

*Type:* **String** - *Default:* 'myModal'

Modal id string

#####modal-heading

*Type:* **String** - (*Optional*) - *Default:* none

Header Text for the modal window

#####btn-modal-positive

*Type:* **String** - *Default:* none

Text for button with positive action on modal

#####btn-modal-negative

*Type:* **String** - *Default:* none

Text for button with negative action on modal

#####btn-modal-positive-clicked-event-name

*Type:* **String** - *Default:* btnModalPositiveClicked

Name of the event that will be raised when the positive modal button is clicked.

#####btn-modal-negative-clicked-event-name

*Type:* **String** - *Default:* btnModalNegativeClicked

Name of the event that will be raised when the negative modal button is clicked.

### Methods

#####modalButtonClicked()
Trigger the modal to open in javascript

### Examples

Modal triggered by button click
```
<px-modal
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <button class="btn btn--primary modal-trigger">Open Modal</button>
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p>Lorem ipsum</p>
</px-modal>
```

Modal triggered by link
```
<px-modal
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <a href="javascript:void(0)" class="modal-trigger">Open Modal</a>
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p><em>Two</em>Lorem ipsum dolor sit amet, </p>
</px-modal>
```

An input that brings up a modal when input loses focus (onblur event)
```
<input onblur="inputLostFocus()" class="text-input" type="text" placeholder="…">
<px-modal
  id="three"
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p><em>Two</em>Lorem ipsum dolor sit amet, </p>
</px-modal>

<script>
  function inputLostFocus(evt){
    Polymer.dom(document).querySelector("#three").modalButtonClicked();
  }
</script>
```

Click on the link to open its modal, click OK to go to www.ge.com:
```
<a href="javascript:void(0)" onclick="gotoLink()">Goto GE.com?</a>
<px-modal
  id="four"
  btn-modal-positive="Continue"
  btn-modal-negative="Back"
  modal-heading="Sign-in required">
    <p>
      <b>Please sign-in to access this part of the application.</b>
    </p>
    <p><em>Two</em>Lorem ipsum dolor sit amet, </p>
</px-modal>

<script>
  function gotoLink(evt){
    Polymer.dom(document).querySelector("#four").modalButtonClicked();
  }

  document.getElementById('four').addEventListener('btnModalPositiveClicked', function() {
    window.location.href = 'https://www.ge.com';
  });
</script>
```



### Local Development
From the component's directory...

```
$ npm install
$ bower install
$ grunt sass
```

### API and examples

From the component's directory

```
$ grunt depserve
```

Starts a local server. Navigate to the root of that server (e.g. http://localhost:8080/) in a browser to open the API documentation page, with link to the "Demo" / working examples.

### Active Development (master branch)
- <a href="http://pxc-demos.grc-apps.svc.ice.ge.com/bower_components/px-modal/demo.html" target="_blank">Demo</a>
- <a href="http://pxc-demos.grc-apps.svc.ice.ge.com/bower_components/px-modal/index.html" target="_blank">API Docs</a>

### Known Issues
- None!
