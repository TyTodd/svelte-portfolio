<svelte:head>
  <title>Contact Me</title>
</svelte:head>
<h1>Contact</h1>
<form class="contact-form" action="mailto:tytodd@mit.edu">
    <label class="contact-label"
    >Subject<input class="contact-input" name="subject"
    /></label>
    <label class="contact-label"
    >Body<textarea class="contact-textarea" name="body"> </textarea>
    </label>
    <button class="contact-button">Submit</button>
</form>