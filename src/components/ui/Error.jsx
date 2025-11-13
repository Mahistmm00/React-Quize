export default function Error({ message = "Something went wrong!" }) {
  return (
    <p className="error">
      <span>💥</span> {message}
    </p>
  );
}