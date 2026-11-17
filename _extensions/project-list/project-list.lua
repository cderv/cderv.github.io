--[[
project-list: write a project entry as one div, get the full markup.

  ::: {.project title="rticles" href="https://github.com/rstudio/rticles"
       logo="images/projects/rticles.png" badge="CRAN"
       meta="Maintainer at Posit · R"}
  R Markdown templates for journal articles.
  :::

Attributes:
  title, href   required: the project name and its link
  logo          image path (hex sticker, logo); or
  icon          a Bootstrap icon name, shown in a hexagon tile
  logo-shape    `round` for a round logo, `cover` for a book cover
  badge         small boxed label after the title (CRAN, Book...)
  meta          the grey line under the summary (role · language)
The div content is the summary.

Output: the `.gw-talk-item .gw-project` structure styled by the Ghostwriter
talk list and styles/site.scss. Wrap entries in `::: {.project-list}`.
--]]

local function attr(el, name)
  local v = el.attributes[name]
  if v == nil or v == "" then return nil end
  return v
end

local function summary_inlines(blocks)
  local out = pandoc.Inlines({})
  for i, b in ipairs(blocks) do
    if b.t == "Para" or b.t == "Plain" then
      if #out > 0 then out:insert(pandoc.Space()) end
      out:extend(b.content)
    end
  end
  return out
end

local function project(div)
  local title = attr(div, "title")
  local href = attr(div, "href")
  if not title or not href then
    io.stderr:write("project-list: a .project div needs title and href\n")
    return nil
  end

  local head = pandoc.Inlines({})
  local shape = attr(div, "logo-shape")
  local logo_classes = { "gw-project-logo" }
  if shape then table.insert(logo_classes, "gw-project-" .. shape) end

  if attr(div, "logo") then
    head:insert(pandoc.Image({}, attr(div, "logo"), "",
      pandoc.Attr("", logo_classes)))
    head:insert(pandoc.Space())
  elseif attr(div, "icon") then
    table.insert(logo_classes, "gw-project-icon")
    head:insert(pandoc.Span({ pandoc.Span({}, pandoc.Attr("", { "bi", "bi-" .. attr(div, "icon") })) },
      pandoc.Attr("", logo_classes)))
    head:insert(pandoc.Space())
  end

  head:insert(pandoc.Link(title, href, "", pandoc.Attr("", { "gw-talk-title" })))
  if attr(div, "badge") then
    head:insert(pandoc.Space())
    head:insert(pandoc.Span(attr(div, "badge"), pandoc.Attr("", { "gw-talk-kind" })))
  end

  local blocks = pandoc.Blocks({ pandoc.Para(head) })
  local summary = summary_inlines(div.content)
  if #summary > 0 then
    blocks:insert(pandoc.Para({ pandoc.Span(summary, pandoc.Attr("", { "gw-talk-summary" })) }))
  end
  if attr(div, "meta") then
    blocks:insert(pandoc.Para({ pandoc.Span(attr(div, "meta"), pandoc.Attr("", { "gw-talk-meta" })) }))
  end

  return pandoc.Div(blocks, pandoc.Attr(div.identifier, { "gw-talk-item", "gw-project" }))
end

function Div(div)
  if div.classes:includes("project") then
    return project(div)
  elseif div.classes:includes("project-list") then
    div.classes = { "list", "gw-talk-list" }
    return div
  end
end
