import { Form, Head, Link } from "@inertiajs/react";
import { Button } from "../../components/button";
import { Label, Input } from "../../components/input";

export default function Sigin() {
  return (
    <>
      <Head>
        <title>Trellix Login</title>
      </Head>
      <div className="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2
            id="login-header"
            className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Log in
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Form className="space-y-6" method="post" action="/session">
              {({ errors }) => (
                <>
                  <div>
                    <Label htmlFor="email">
                      Email address{" "}
                      {errors?.email && (
                        <span id="email-error" className="text-brand-red">
                          {errors.email}
                        </span>
                      )}
                    </Label>
                    <Input
                      autoFocus
                      id="email"
                      name="email_address"
                      type="email"
                      autoComplete="email"
                      aria-describedby={
                        errors?.email ? "email-error" : "login-header"
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">
                      Password{" "}
                      {errors?.password && (
                        <span id="password-error" className="text-brand-red">
                          {errors.password}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      aria-describedby="password-error"
                      required
                    />
                  </div>

                  <div>
                    <Button type="submit">Sign in</Button>
                  </div>
                  <div className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link className="underline" href="/users/new">
                      Sign up
                    </Link>
                    .
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
