import { Header } from "./Header";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Head from "next/head";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export function Users() {
  const { data: session } = useSession();
  const { data, error } = useSWR("/api/manageUserObjects", fetcher, {
    refreshInterval: 1000,
  });
  let isUserAdmin = false;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    admin: "false",
  });

  // Make sure form input is accurate and up to date
  const handleInput = (e: any) => {
    const fieldName = e.target.name;
    let fieldValue = "";
    if (e.target.type == "checkbox") {
      fieldValue = formData.admin == "true" ? "false" : "true";
    } else {
      fieldValue = e.target.value;
    }

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  // Handles POST request for the input
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const data = {
      action: event.target.action.value,
      name: event.target.name.value,
      email: event.target.email.value,
      admin: event.target.admin.value,
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = "/api/manageUserObjects";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);

    const result = await response.json();
    if (result.code == 200) {
      setFormData({
        name: "",
        email: "",
        admin: "false",
      });
    } else if (result.code == 422) {
      setFormData({
        name: "",
        email: "",
        admin: "false",
      });
      alert("This user already exists");
    } else {
      alert("Something has gone wrong, please contact the site Admin");
    }
  };

  // If data errors show sad face
  if (error) {
    return (
      <section className="flex h-full items-center dark:bg-gray-800 dark:text-gray-100 sm:p-16">
        <div className="container mx-auto my-8 flex flex-col items-center justify-center space-y-8 px-5 text-center sm:max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-40 w-40 dark:text-gray-600"
          >
            <path
              fill="currentColor"
              d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"
            ></path>
            <rect
              width="176"
              height="32"
              x="168"
              y="320"
              fill="currentColor"
            ></rect>
            <polygon
              fill="currentColor"
              points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"
            ></polygon>
            <polygon
              fill="currentColor"
              points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"
            ></polygon>
          </svg>
          <p className="text-3xl">Something went wrong. Try again later</p>
        </div>
      </section>
    );
  }

  // While data loading, show animation
  if (!data) {
    return (
      <div className="min-w-screen flex min-h-screen items-center justify-center bg-gray-800 p-5">
        <div className="flex animate-pulse space-x-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (session) {
    //Check if user is admin or not
    data.forEach(function (user: any) {
      if (user.email == session.user!.email) {
        if (user.admin) {
          isUserAdmin = true;
        }
      }
    });
    return (
      <>
        <Head>
          <title>Users - {process.env.NEXT_PUBLIC_SITENAME}</title>
        </Head>
        <Header />
        <div className="hidden justify-center py-5 md:hidden lg:flex">
          <div className="md:flex-1"></div>
          <div className="md:flex-grow">
            <div className="overflow-auto rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="w-12 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      Name
                    </th>
                    <th className="w-12 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      Email
                    </th>
                    <th className="w-5 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      Admin
                    </th>
                    <th className="w-20 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {data.map((user: any) => {
                    return (
                      <tr key={user.email} className="bg-gray-700">
                        <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                          {user.admin.toString()}
                        </td>
                        <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                          <form onSubmit={handleSubmit}>
                            <input
                              type="hidden"
                              id="name"
                              name="name"
                              value={user.name}
                            ></input>
                            <input
                              type="hidden"
                              id="email"
                              name="email"
                              value={user.email}
                            ></input>
                            <input
                              type="hidden"
                              id="admin"
                              name="admin"
                              value={user.admin.toString()}
                            ></input>
                            <button
                              type="submit"
                              name="action"
                              value="delete"
                              className="rounded-lg bg-red-200 p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 hover:bg-red-400"
                              disabled={!isUserAdmin}
                            >
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-700" hidden={!isUserAdmin}>
                    <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        onChange={handleInput}
                        value={formData.name}
                        className="rounded-lg border text-center focus:ring-inset focus:ring-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                      ></input>
                    </td>
                    <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                      <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleInput}
                        value={formData.email}
                        className="rounded-lg border text-center focus:ring-inset focus:ring-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                      ></input>
                    </td>
                    <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          id="admin"
                          name="admin"
                          onChange={handleInput}
                          value={formData.admin}
                          className="peer sr-only"
                          checked={formData.admin == "true"}
                        ></input>
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:peer-focus:ring-blue-800"></div>
                      </label>
                    </td>
                    <td className="whitespace-nowrap p-3 text-center text-sm text-white">
                      <form onSubmit={handleSubmit}>
                        <input
                          type="hidden"
                          id="name"
                          name="name"
                          value={formData.name}
                        ></input>
                        <input
                          type="hidden"
                          id="email"
                          name="email"
                          value={formData.email}
                        ></input>
                        <input
                          type="hidden"
                          id="admin"
                          name="admin"
                          value={formData.admin.toString()}
                        ></input>
                        <button
                          type="submit"
                          name="action"
                          value="create"
                          className="rounded-lg bg-green-200 p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 hover:bg-green-400"
                        >
                          Create
                        </button>
                      </form>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:flex-1"></div>
        </div>
        <br />
        <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 lg:hidden">
          {data.map((user: any) => {
            return (
              <div
                key={user.email}
                className="space-y-2 rounded-lg bg-gray-900 p-4 shadow"
              >
                <div className="flex items-center space-x-2 text-lg text-white">
                  <div>{user.name}</div>
                </div>
                <div className="text-md text-gray-200">{user.email}</div>
                <div className="text-sm text-blue-400">
                  {user.admin ? "Admin" : ""}
                </div>
                <form onSubmit={handleSubmit}>
                  <input
                    type="hidden"
                    id="name"
                    name="name"
                    value={user.name}
                  ></input>
                  <input
                    type="hidden"
                    id="email"
                    name="email"
                    value={user.email}
                  ></input>
                  <input
                    type="hidden"
                    id="admin"
                    name="admin"
                    value={user.admin ? "true" : "false"}
                  ></input>
                  <button
                    type="submit"
                    name="action"
                    value="delete"
                    disabled={!isUserAdmin}
                    className="rounded-lg bg-red-200 p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 hover:bg-red-400"
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })}
          <form onSubmit={handleSubmit} hidden={!isUserAdmin}>
            <div className="space-y-2 rounded-lg bg-gray-900 p-4 shadow">
              <div className="flex items-center space-x-2 text-lg text-white">
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    onChange={handleInput}
                    value={formData.name}
                    className="rounded-lg border focus:ring-inset focus:ring-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  ></input>
                </div>
              </div>
              <div className="text-md text-gray-200">
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInput}
                  value={formData.email}
                  className="rounded-lg border focus:ring-inset focus:ring-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                ></input>
              </div>
              <div className="text-sm text-blue-400">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    id="admin"
                    name="admin"
                    onChange={handleInput}
                    value={formData.admin}
                    className="peer sr-only"
                    checked={formData.admin == "true"}
                  ></input>
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                  <span className="ml-3 text-sm font-medium text-blue-400 dark:text-blue-400">
                    Admin
                  </span>
                </label>
              </div>

              <button
                type="submit"
                name="action"
                value="create"
                className="rounded-lg bg-green-200 p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 hover:bg-green-400"
              >
                Create
              </button>
            </div>
          </form>
        </div>
        <br></br>
      </>
    );
  } else {
    return <></>;
  }
}

export default Users;
