import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  if (!token || !type) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  const supabaseUrl = getSupabaseUrl(request);
  const redirectTo = getAppLink(request);

  const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${token}&type=${type}&redirect_to=${encodeURIComponent(redirectTo)}`;

  console.log("calling supabase verify url:", verifyUrl);

  try {
    const response = await fetch(verifyUrl, {
      method: "GET",
      redirect: "manual",
    });

    console.log("supabase response status:", response.status);

    const location = response.headers.get("location");
    if (!location) {
      console.log("no location found");
      return NextResponse.redirect(new URL("/error", request.url));
    }

    console.log("redirect location:", location);

    const locationUrl = new URL(location);
    const fragment = locationUrl.hash;

    console.log("fragment:", fragment);

    const appLink = `${redirectTo}${fragment}`;

    console.log("final app link:", appLink);

    return NextResponse.redirect(appLink);
  } catch (error) {
    console.log("auth verification error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

function getAppLink(request: NextRequest) {
  let env: "dev" | "preview" | "prod";
  const hostname = request.headers.get("host") || "";
  if (hostname.includes("dev.")) {
    env = "dev";
  } else if (hostname.includes("preview.")) {
    env = "preview";
  } else {
    env = "prod";
  }
  return process.env[`APP_AUTH_LINK_${env.toUpperCase()}`]!;
}

function getSupabaseUrl(request: NextRequest) {
  let env: "dev" | "preview" | "prod";
  const hostname = request.headers.get("host") || "";
  if (hostname.includes("dev.")) {
    env = "dev";
  } else if (hostname.includes("preview.")) {
    env = "preview";
  } else {
    env = "prod";
  }
  return process.env[`SUPABASE_URL_${env.toUpperCase()}`]!;
}
