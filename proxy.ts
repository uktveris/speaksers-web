import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  let env: "dev" | "preview" | "prod";
  if (hostname.includes("dev.")) {
    env = "dev";
  } else if (hostname.includes("preview.")) {
    env = "preview";
  } else {
    env = "prod";
  }

  if (
    request.nextUrl.pathname === "/.well-known/apple-app-site-association" ||
    request.nextUrl.pathname === "/apple-app-site-association"
  ) {
    const aasa = getAASA(env);

    return new NextResponse(JSON.stringify(aasa), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  if (request.nextUrl.pathname === "/.well-known/assetlinks.json") {
    const assetlinks = getAssetLinks(env);

    return new NextResponse(JSON.stringify(assetlinks), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return NextResponse.next();
}

function getAASA(env: "dev" | "preview" | "prod") {
  const suffix = env === "prod" ? "" : `.${env}`;

  return {
    applinks: {
      apps: [],
      details: [{ appID: `MJC38BUU22.com.speaksersedu.speaksers${suffix}`, paths: ["*"] }],
    },
  };
}

function getAssetLinks(env: "dev" | "preview" | "prod") {
  const suffix = env === "prod" ? "" : `.${env}`;

  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: `com.speaksersedu.speaksers${suffix}`,
        sha256_cert_fingerprints: [process.env[`SHA256_FINGERPRINT_${env.toUpperCase()}`] || ""],
      },
    },
  ];
}

export const config = {
  matcher: ["/.well-known/apple-app-site-association", "/apple-app-site-association", "/.well-known/assetlinks.json"],
};
