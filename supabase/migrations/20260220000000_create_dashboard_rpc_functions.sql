-- Create RPC function to get activity data for dashboard
-- This replaces 30+ sequential queries with a single optimized query

CREATE OR REPLACE FUNCTION get_activity_data(days_count INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  trips_count BIGINT,
  bookings_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (days_count - 1),
      CURRENT_DATE,
      '1 day'::interval
    )::DATE AS date
  ),
  trips_by_date AS (
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS trips_count
    FROM trips
    WHERE created_at >= CURRENT_DATE - (days_count - 1)
    GROUP BY DATE(created_at)
  ),
  bookings_by_date AS (
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS bookings_count
    FROM bookings
    WHERE created_at >= CURRENT_DATE - (days_count - 1)
    GROUP BY DATE(created_at)
  )
  SELECT 
    ds.date,
    COALESCE(t.trips_count, 0)::BIGINT AS trips_count,
    COALESCE(b.bookings_count, 0)::BIGINT AS bookings_count
  FROM date_series ds
  LEFT JOIN trips_by_date t ON ds.date = t.date
  LEFT JOIN bookings_by_date b ON ds.date = b.date
  ORDER BY ds.date;
END;
$$;

-- Grant execute permission to authenticated users (admins)
GRANT EXECUTE ON FUNCTION get_activity_data(INTEGER) TO authenticated;

