import { login } from "../actions/auth";

// app/login/page.tsx
export default function LoginPage() {
  return (
    <main className="flex flex-col  h-[100vh]">

      <form  action={login} className="flex flex-col justify-center align-center m-auto ">
              <h1 className="font-extrabold text-center m-4 text-3xl font-serif ">User Login</h1>

        <table>
            <tbody>
          <tr>
            <td className="p-2">
              <label htmlFor="email"  className="font-serif">Email</label>
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
              <label htmlFor="password" className="font-serif">Password</label>
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

        <button type="submit" className="bg-amber-50 text-black p-2 px-4 font-serif   rounded">Log in</button>
      </form>
    </main>
  );
}
