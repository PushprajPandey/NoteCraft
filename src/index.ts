import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

type Variables = {
  user: { id: string; email: string } | null;
  supabase: ReturnType<typeof createClient>;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// CORS middleware - Updated for Vercel deployment
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://note-craft-inky.vercel.app",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Initialize Supabase client middleware
app.use("/api/*", async (c, next) => {
  const supabaseUrl = c.env.SUPABASE_URL;
  const supabaseKey = c.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return c.json({ error: "Supabase configuration missing" }, 500);
  }

  const authHeader = c.req.header("Authorization");
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });

  c.set("supabase", supabase);
  await next();
});

// Auth middleware for protected routes
app.use("/api/notes/*", async (c, next) => {
  const supabase = c.get("supabase");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", { id: user.id, email: user.email || "" });
  await next();
});

// ===== AUTH ROUTES =====

// Get current user
app.get("/api/auth/user", async (c) => {
  const supabase = c.get("supabase");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return c.json({ user: null });
  }

  return c.json({ user: { id: user.id, email: user.email } });
});

// ===== NOTES ROUTES =====

// Get all notes for authenticated user
app.get("/api/notes", async (c) => {
  const supabase = c.get("supabase");
  const user = c.get("user");

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ notes });
});

// Get single note
app.get("/api/notes/:id", async (c) => {
  const supabase = c.get("supabase");
  const user = c.get("user");
  const id = c.req.param("id");

  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (error) {
    return c.json({ error: "Note not found" }, 404);
  }

  return c.json({ note });
});

// Create note
app.post("/api/notes", async (c) => {
  const supabase = c.get("supabase");
  const user = c.get("user");

  try {
    const body = await c.req.json();
    const { title, content } = body;

    if (!title?.trim()) {
      return c.json({ error: "Title is required" }, 400);
    }

    const { data: note, error } = await supabase
      .from("notes")
      .insert({
        user_id: user?.id,
        title: title.trim(),
        content: content?.trim() || "",
      })
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ note }, 201);
  } catch {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// Update note
app.put("/api/notes/:id", async (c) => {
  const supabase = c.get("supabase");
  const user = c.get("user");
  const id = c.req.param("id");

  try {
    const body = await c.req.json();
    const { title, content } = body;

    if (!title?.trim()) {
      return c.json({ error: "Title is required" }, 400);
    }

    const { data: note, error } = await supabase
      .from("notes")
      .update({
        title: title.trim(),
        content: content?.trim() || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user?.id)
      .select()
      .single();

    if (error) {
      return c.json({ error: "Note not found or access denied" }, 404);
    }

    return c.json({ note });
  } catch {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// Delete note
app.delete("/api/notes/:id", async (c) => {
  const supabase = c.get("supabase");
  const user = c.get("user");
  const id = c.req.param("id");

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user?.id);

  if (error) {
    return c.json({ error: "Failed to delete note" }, 500);
  }

  return c.json({ success: true });
});

export default app;
