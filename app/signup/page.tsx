import { signup } from "../actions/auth";

// app/login/page.tsx
export default function SignUpPage() {
  return (
    <main className="flex flex-col  h-screen">
      <form  action="/api/register" className="flex flex-col justify-center align-center m-auto ">
        <h1 className="font-extrabold text-center m-4 text-3xl font-serif ">
          Create User Account
        </h1>

        <table>
          <tbody>
            <tr>
              <td className="p-2">
                <label htmlFor="name" className="font-serif">
                  Name
                </label>
              </td>
              <td className="p-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="p-2">
                <label htmlFor="email" className="font-serif">
                  Email
                </label>
              </td>
              <td className="p-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="p-2">
                {" "}
                <label htmlFor="password" className="font-serif">
                  Password
                </label>
              </td>
              <td className="p-2">
                {" "}
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="submit"
          className="bg-amber-50 text-black p-2 px-4 font-serif   rounded"
        >
          Create
        </button>
      </form>
    </main>
  );
}
