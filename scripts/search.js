
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export function startSearch(param){
    const url = 'https://vnqdicxxneesaxrttein.supabase.co/functions/v1/fetch_search';

    const data = {
        name: 'Irekanmi'
    };

    const options = {
        method: 'POST',
        headers: {
//            ...corsHeaders,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, options)
        .then(response => {

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
        console.log('Response data:', data);
        alert('Alert says ', data);
    })
        .catch(error => {
        // Handle any errors that occurred during the request
        console.error('There was a problem with your fetch operation:', error);
    });

}