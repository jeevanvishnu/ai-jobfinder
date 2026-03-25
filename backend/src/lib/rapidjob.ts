import axios from "axios";

const options = {
  method: 'GET',
  url: 'https://jsearch.p.rapidapi.com/job-details',
  params: {
    job_id: '81db785ad33ce9d5',
  },
  headers: {
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    'x-rapidapi-host': process.env.RAPID_API_HOST,
    'Content-Type': 'application/json'
  }
};

export async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

