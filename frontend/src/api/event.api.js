import { api } from "./client.js";

export const getAllEvents = async (search = '') => {
  const cleanSearch = search.trim();
  
  // Only include search in params if a search term exists
  const config = cleanSearch ? { params: { search: cleanSearch } } : {};

  const response = await api.get('/events', config); 
  return response.data;
};

export const getMyEvents = async () => {
    const response = await api.get('/events/my-events');
    return response.data;
};

export const getEventById = async (id) => {
    const response = await api.get(`/events/${id}`);

    return response.data;
};

export const createEvent = async (data) => {
    // transform object into FormData so the request can carry the actual file along with your other form fields.
    let body = data;

    if (!(data instanceof FormData)) {
        body = new FormData(); // making body a empty formData type
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
                body.append(key, data[key]);
            }
        });
    }

    const response = await api.post('/events', body);

    return response.data;
};

export const updateEvent = async (id, data) => {

    const formData = new FormData();

    // Object.keys(data) - convert data keys into array, so we can loop through it
    // we can only use forEach loop in array not in object
    Object.keys(data).forEach((key) => {
        // Only append/add image if it's a newly selected File object
        if (key === 'image') {
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }

            // data[key] means value of that key, { name: 'ram' }
            // it will give ram - only value, not key
        } else if (data[key] !== undefined && data[key] !== null) {

            // Put the value data[key] under the field name key in FormData
            formData.append(key, data[key]);
        }
    });

    const response = await api.patch(`/events/${id}`, formData);

    return response.data;
};

export const cancelEvent = async (id) => {
    const response = await api.patch(`/events/${id}/cancel`);

    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}/delete`);
    return response.data;
}

/**
 response.data =  {
        "status": "success",
        "statusCode": 200,
        "message": "Events fetched successfully",
        "data": [
            { "id": 1, "title": "Holi Festival" },
            { "id": 2, "title": "Music Night" }
        ]
    }

    inside response data there is data in [] array format 
 */
