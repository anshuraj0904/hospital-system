- A basic Hospital Management system using MERN stack

# Next:- API for getting the treatment list for the admin, doctor and patient respectively, and all of those will be a bit different.
- Admin: Just get all
- Doctor: Filter by createdBy
- Patient: Filteration will be a bit different. At first, we'll have to get the list of closed appointments for the patientId, then, loop through those into the Treatment w.r.t the appointmentId.