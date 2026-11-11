const submitButton = document.getElementById('submitButton');
const megatron = document.getElementById('megatrons');
const commentBox = document.getElementById('commentBox');
import { createClient } from '@supabase/supabase-js'
console.log(process.env)
// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')

submitButton.addEventListener('click', async () => {    
    const { error } = await supabase
  .from('comments')
  .insert({ comment:  commentBox.value })
})