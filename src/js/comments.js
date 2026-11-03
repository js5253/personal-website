const submitButton = document.getElementById('submitButton');
const megatron = document.getElementById('megatrons');
const commentBox = document.getElementById('commentBox');

submitButton.addEventListener('click', async () => {    
    const { error } = await supabase
  .from('comments')
  .insert({ comment:  commentBox.value })
})