// The historical Season 10 source remains in repository storage, not in the public catalog.
export async function GET(){return Response.json({items:[],stats:[],available:false},{status:410})}
