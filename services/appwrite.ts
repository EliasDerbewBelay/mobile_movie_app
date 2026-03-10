import { Client, ID, Query, TablesDB } from "react-native-appwrite";

// 1. Setup constants
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

// 2. Initialize the new TablesDB service
const tables = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // 3. Use listRows (the new listDocuments)
    const result = await tables.listRows(DATABASE_ID, TABLE_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];

      // 4. Use the NEW Atomic Increment method
      // This is faster and safer than manually calculating count + 1
      await tables.incrementRowColumn(
        DATABASE_ID,
        TABLE_ID,
        existingMovie.$id,
        "count", // The column name
        1, // The amount to increase by
      );
    } else {
      // 5. Use createRow (the new createDocument)
      await tables.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Appwrite Error:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await tables.listRows(DATABASE_ID, TABLE_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
