-- Notify function
create function notify_delivery()
  returns trigger
  language plpgsql
as $function$
begin
  perform pg_notify('notify_delivery', row_to_json(NEW)::text);
  return NULL;
end
$function$;

-- Create trigger on table
create trigger updated_delivery after insert on reward_shippings
for each row execute procedure notify_delivery();

-- Use
listen notify_delivery;

-- Cleanup
drop trigger updated_delivery on reward_shippings;
drop function notify_delivery;