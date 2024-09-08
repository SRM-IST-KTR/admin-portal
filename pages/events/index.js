import withAuth from "@/components/withAuth";

const Events = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Events</h1>
      <p className="mt-4">Welcome to the Events page!</p>
    </div>
  );
};

export default withAuth(Events);
