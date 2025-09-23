interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

class DataService {
  private readonly apiUrl: string;

  constructor(baseUrl: string) {
    this.apiUrl = baseUrl;
  }

  async consultarDatos(): Promise<Post[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
      }
      const datos: Post[] = await response.json();
      return datos;
    } catch (error) {
      console.error("Error al consultar los datos:", error);
      return [];
    }
  }

  async crearPost(nuevoPost: Omit<Post, 'id'>): Promise<Post | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify(nuevoPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
      }
      const postCreado: Post = await response.json();
      return postCreado;
    } catch (error) {
      console.error("Error al crear el post:", error);
      return null;
    }
  }

  async editarPost(id: number, datosActualizados: Partial<Omit<Post, 'id'>>): Promise<Post | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ id, ...datosActualizados }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
      }
      const postActualizado: Post = await response.json();
      return postActualizado;
    } catch (error) {
      console.error(`Error al editar el post con id ${id}:`, error);
      return null;
    }
  }

  async eliminarPost(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
      }
      console.log(`Post con id ${id} eliminado exitosamente.`);
    } catch (error) {
      console.error(`Error al eliminar el post con id ${id}:`, error);
    }
  }
}

async function ejecutarEjemplo() {
  const urlBase: string = 'https://jsonplaceholder.typicode.com/posts';

  const servicio = new DataService(urlBase);

  console.log("--- 1. Consultando datos... ---");
  const posts = await servicio.consultarDatos();
  console.log("Primeros 5 posts obtenidos:", posts.slice(0, 5));
  console.log("\n");

  console.log("--- 2. Creando un nuevo post... ---");
  const miNuevoPost = {
    title: 'Mi Título de Prueba',
    body: 'Este es el contenido de mi post.',
    userId: 10,
  };
  const postCreado = await servicio.crearPost(miNuevoPost);
  if (postCreado) {
    console.log("Post creado exitosamente:", postCreado);
  }
  console.log("\n");

  console.log("--- 3. Editando el post con ID 2... ---");
  const datosParaEditar = {
    title: 'Título actualizado desde TypeScript',
    body: 'Contenido modificado con la función editarPost.'
  };
  const postEditado = await servicio.editarPost(2, datosParaEditar);
  if (postEditado) {
    console.log("Post editado exitosamente:", postEditado);
  }
  console.log("\n");

  console.log("--- 4. Eliminando el post con ID 1... ---");
  const idParaEliminar: number = 1;
  await servicio.eliminarPost(idParaEliminar);
}

ejecutarEjemplo();
