export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      care_plans: {
        Row: {
          created_at: string
          description: string | null
          generated_at: string
          id: string
          is_active: boolean | null
          session_summary_id: string | null
          tasks: Json
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          generated_at?: string
          id?: string
          is_active?: boolean | null
          session_summary_id?: string | null
          tasks?: Json
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          generated_at?: string
          id?: string
          is_active?: boolean | null
          session_summary_id?: string | null
          tasks?: Json
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_plans_session_summary_id_fkey"
            columns: ["session_summary_id"]
            isOneToOne: false
            referencedRelation: "session_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      care_task_completions: {
        Row: {
          care_plan_id: string | null
          completed_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          care_plan_id?: string | null
          completed_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          care_plan_id?: string | null
          completed_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_task_completions_care_plan_id_fkey"
            columns: ["care_plan_id"]
            isOneToOne: false
            referencedRelation: "care_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string
          id: string
          logged_at: string
          mood_score: number
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          logged_at?: string
          mood_score: number
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          logged_at?: string
          mood_score?: number
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          care_plan_id: string | null
          channel: string
          created_at: string
          id: string
          message: string | null
          scheduled_at: string
          sent_at: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          care_plan_id?: string | null
          channel?: string
          created_at?: string
          id?: string
          message?: string | null
          scheduled_at: string
          sent_at?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          care_plan_id?: string | null
          channel?: string
          created_at?: string
          id?: string
          message?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_care_plan_id_fkey"
            columns: ["care_plan_id"]
            isOneToOne: false
            referencedRelation: "care_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      session_summaries: {
        Row: {
          created_at: string
          id: string
          key_takeaways: string[] | null
          provider_name: string | null
          session_date: string
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_takeaways?: string[] | null
          provider_name?: string | null
          session_date: string
          summary: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_takeaways?: string[] | null
          provider_name?: string | null
          session_date?: string
          summary?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
